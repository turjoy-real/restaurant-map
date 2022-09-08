import { Alert, Button, Image } from "native-base";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import useAuthData from "../../store/selectors/auth";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { patch, post, productImagesDocsRef } from "../../APIs/helpers";
import app from "firebase/compat/app";
import "firebase/compat/storage";
import { baseUrl } from "../../utils/baseUrl";

export default function AttendanceScreen() {
  const Auth = useAuthData();
  const userId = Auth.userId ? Auth.userId : "";
  // Attendance image
  const [imageData, setImageData] = useState({
    title: "",
    file: "",
    author: "",
    timestamp: "",
  });
  const [imgLoading, setImgLoading] = useState(false);
  const [data, setData] = useState();
  const [image, setImage] = useState("");
  const [location, setLocation] = useState<any | null>(null);
  const [address, setAddress] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: 3 });
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (!!location && !!address) {
    text = `${address.name} | ${address.city}, ${address.region} ${address.postalCode}, ${address.country}`;
    // text = JSON.stringify({ location });
  }
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync();

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      const add = await Location.reverseGeocodeAsync(location.coords);
      setAddress(add[0]);
      console.log("ggg", add);
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     const add = await Location.reverseGeocodeAsync(location, {
  //       accuracy: 3,
  //     });
  //     setAddress(add);
  //     console.log("ggg", add);
  //   })();

  //   return () => {
  //     // this now gets called when the component unmounts
  //   };
  // }, [image]);

  // useEffect(() => {
  //   Location.setGoogleApiKey("AIzaSyDaJLTTolQuMcE8p98s_ElUpBSvbRkR-6g");
  // }, []);

  // Image Upload:

  const onImageUpload = async () => {
    setImgLoading(true);
    let createDate = new Date();
    let timestamp = createDate.toISOString();
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    try {
      await app
        .storage()
        .ref(`users/${userId}/attendanceImages/${timestamp}/`)
        .put(blob);

      let fileLink = await app
        .storage()
        .ref(`users/${userId}/attendanceImages/${timestamp}/`)
        .getDownloadURL();

      setImageData({
        title: Auth.userId ? "ABC" : "Null",
        file: fileLink,
        author: Auth.userId ? "ABC" : "Null",
        timestamp,
      });

      if (userId && timestamp) {
        const response = await fetch(
          `https://pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/attendance/${userId}/${timestamp}.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: Auth.userId ? "ABC" : "Null",
              file: fileLink,
              author: Auth.userId ? "ABC" : "Null",
              timestamp,
              text,
              // location,
            }),
          }
        );
        // const response = await post(`attendance/${userId}/${timestamp}`, {
        //   title: Auth.userId ? "ABC" : "Null",
        //   file: fileLink,
        //   author: Auth.userId ? "ABC" : "Null",
        //   timestamp,
        //   text,
        //   // location,
        // });
        const res = await response.json();

        console.log("...", res, userId, timestamp, fileLink);
      }

      // await productImagesDocsRef(userId, timestamp).put(blob);
    } catch (error: any) {
      console.log("ll", error.message);
    }

    // console.log("upload try", fileLink);
    blob.close();
    //eslint-disable-next-line

    setImgLoading(false);
  };

  // Delete Image
  const handleImageDelete = async () => {
    await app
      .storage()
      .ref(`users/${userId}/attendanceImages/${imageData.timestamp}/`)
      .delete()
      .then(() => {
        setImageData({
          title: "Null",
          file: "",
          author: "Null",
          timestamp: "",
        });
      })
      .catch((e: any) => console.log(e.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Screen</Text>
      <Button onPress={takePhoto}>Take Photo</Button>

      {!!image && (
        <>
          <Image
            alt={"stuff"}
            source={{ uri: image }}
            style={{ width: 200, height: 200 }}
          />
          <Text>{text}</Text>
        </>
      )}
      <Button onPress={handleImageDelete}>Delete</Button>
      <Button onPress={onImageUpload}>Confirm</Button>
      <Button onPress={() => console.log(imageData)}>Log</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
