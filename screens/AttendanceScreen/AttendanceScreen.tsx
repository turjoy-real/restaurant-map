import {
  Button,
  HStack,
  Image,
  Avatar,
  Divider,
  Box,
  VStack,
} from "native-base";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import useAuthData from "../../store/selectors/auth";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { patch, post } from "../../APIs/helpers";
import app from "firebase/compat/app";
import "firebase/compat/storage";
import { BoxI } from "../../components/molecules/BoxI";

export default function AttendanceScreen() {
  const Auth = useAuthData();
  const userId = Auth.userId ? Auth.userId : "";
  // Attendance image
  const [imageData, setImageData] = useState({
    title: "",
    file: "",
    author: "",
    timestamp: "",
    approved: false,
  });
  const [imgLoading, setImgLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
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
    }
  };

  const onImageUpload = async () => {
    setImgLoading(true);
    let createDate = new Date();
    let timestamp: number = Date.parse(createDate.toISOString());

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
        timestamp: createDate.toISOString(),
        approved: false,
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
              approved: false,
              text,
              // location,
            }),
          }
        );

        const res = await response.json();

        // console.log("...", res);
      }

      // await productImagesDocsRef(userId, timestamp).put(blob);
    } catch (error: any) {
      console.log("ll", error.message);
    }
    blob.close();
    //eslint-disable-next-line

    setImgLoading(false);
  };

  // Delete Image
  const handleImageDelete = async () => {
    let createDate = new Date();
    // let timestamp: number = Date.parse(createDate.toISOString());
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
          approved: false,
        });
      })
      .catch((e: any) => console.log(e.message));
  };

  // Present, absent, overtimr array

  // const presentArray = [
  //   ["Present", "Absent", "Half Day"],
  //   ["Leave", "Late Fine", "Overtime"],
  // ];

  // Current Year and month

  const currentYear = new Date().getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateObj = new Date();
  const monthNumber = dateObj.getMonth();
  const monthName = monthNames[monthNumber];

  return (
    <View style={styles.container}>
      <Box m="2">
        <Text>
          {currentYear} {monthName}
        </Text>
      </Box>
      <Divider m="4" thickness="2" />

      {/* {presentArray.forEach((employeeA) => {
        employeeA.forEach((data) => {
          console.log(data);
        });
      })} */}

      <Button onPress={takePhoto}>Take Photo</Button>

      {!!image && (
        <>
          <HStack alignItems="center">
            <Image alt={"stuff"} source={{ uri: image }} size="xs" m="2" />

            <Text>{text}</Text>
          </HStack>
        </>
      )}
      <HStack>
        {/* <Button onPress={handleImageDelete} m="5">
          Delete
        </Button> */}
        <Button
          onPress={() => {
            setDeleteConfirm((prevState) => !prevState), handleImageDelete;
          }}
          m="5"
        >
          {`${!deleteConfirm ? "Delete" : "Confirm Delete"}`}
        </Button>
        <Button onPress={onImageUpload} m="5">
          Confirm
        </Button>
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "space-evenly",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
