import {
  Button,
  HStack,
  Image,
  Avatar,
  Divider,
  Box,
  VStack,
  Spinner,
  Icon,
  IconButton,
  Card,
  ScrollView,
} from "native-base";
import * as FileSystem from "expo-file-system";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import useAuthData from "../../store/selectors/auth";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import app from "firebase/compat/app";
import "firebase/compat/storage";
import { IconButtonUI } from "../../components/atoms/IconButton";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { timeStamp } from "console";
import { writeFile, readFile } from "react-native-fs";
import * as Sharing from "expo-sharing";

import XLSX from "xlsx";

function getAllDaysInMonth(year: number, month: number) {
  const createDate = new Date(year, month, 1);

  const dates = [];

  while (createDate.getMonth() === month) {
    let date = createDate.getDate();
    let month = createDate.getMonth() + 1;
    let year = createDate.getFullYear();
    let newDate = date + "-" + month + "-" + year;
    dates.push(newDate);
    createDate.setDate(createDate.getDate() + 1);
  }

  return dates;
}

export default function AttendanceScreen() {
  const Auth = useAuthData();
  const userId = Auth.userId ? Auth.userId : "";
  const [attendState, setAttendState] = useState({
    title: "",
    file: "",
    author: "",
    timestamp: "",
    approved: false,
    location: "",
    present: false,
    id: "",
    address: "",
  });
  const [imgLoading, setImgLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<any | null>(null);
  const [address, setAddress] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<any | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  type T = typeof attendState;

  const [data, setData] = useState<any | null>(null);
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

  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: 3 });
      setLocation(location);
      Location.setGoogleApiKey("AIzaSyDaJLTTolQuMcE8p98s_ElUpBSvbRkR-6g");
    })();
  }, []);

  // Fetch attendance

  useEffect(() => {
    let createDate = new Date();
    let date = createDate.getDate();
    let month = createDate.getMonth() + 1;
    let year = createDate.getFullYear();
    let newDate = date + "-" + month + "-" + year;

    let timestamp: string = newDate;
    async function getAttendances() {
      const response = await fetch(
        `https://pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/attendance/${Auth.currentCompany}/${timestamp}/${Auth.userId}.json`
      );
      const resData = await response.json();
      // console.log("resData", resData);
      let arr: T[] = [];

      // for (const key in resData) {
      //   arr.push({
      //     id: key,
      //     title: resData[key].title,
      //     file: resData[key].file,
      //     author: resData[key].author,
      //     timestamp: resData[key].timestamp,
      //     approved: resData[key].approved,
      //     address: resData[key].address,
      //     location: resData[key].location,
      //     present: resData[key].present,
      //   });
      // }

      if (resData) {
        arr.push(resData);
        setData(arr);
      }

      console.log("resData", arr, resData);
    }

    getAttendances();
  }, [Auth.currentCompany, Auth.userId]);

  const [text, setText] = useState("Waiting");

  useEffect(() => {
    if (errorMsg) {
      setText(errorMsg);
    } else if (!!location && !!address) {
      setText(
        `${address.name} | ${address.city}, ${address.region} ${address.postalCode}, ${address.country}`
      );
      // text = JSON.stringify({ location });
    }
    console.log("====================================");
    console.log(location, address);
    console.log("====================================");
  }, [address, location, image]);

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync();

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      const add = await Location.reverseGeocodeAsync(location.coords);
      console.log("====================================");
      console.log(add);
      console.log("====================================");
      setAddress(add[0]);
    }
  };

  const onImageUpload = async () => {
    setImgLoading(true);
    let createDate = new Date();
    let date = createDate.getDate();
    let month = createDate.getMonth() + 1;
    let year = createDate.getFullYear();
    let newDate = date + "-" + month + "-" + year;

    let timestamp: string = newDate;

    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image ? image : "", true);
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

      // ---will go to redux

      // console.log(
      //   `https://pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/attendance/${Auth.currentCompany}/${timestamp}/${userId}.json`
      // );

      // console.log({
      //   title: Auth.userId ? "ABC" : "Null",
      //   file: await fileLink,
      //   author: `${Auth.fullName}`,
      //   timestamp,
      //   approved: false,
      //   address: text,
      //   location,
      //   present: false,
      // });

      if (userId && timestamp) {
        const response = await fetch(
          `https://pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/attendance/${Auth.currentCompany}/${timestamp}/${userId}.json`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: Auth.userId ? "ABC" : "Null",
              file: await fileLink,
              author: `${Auth.fullName}`,
              timestamp,
              approved: false,
              address: text,
              location,
              present: false,
            }),
          }
        );

        setAttendState({
          title: Auth.userId ? "ABC" : "Null",
          file: fileLink,
          author: `${Auth.fullName}`,
          timestamp,
          approved: false,
          location,
          present: false,
          id: `${Auth.userId}`,
          address: text,
        });

        let arr: T[] = data ? [...data] : [];

        arr.push({
          title: Auth.userId ? "ABC" : "Null",
          file: fileLink,
          author: `${Auth.fullName}`,
          timestamp,
          approved: false,
          location,
          present: false,
          id: `${Auth.userId}`,
          address: text,
        });

        setData(arr);
        setImage(null);
        setAddress(null);

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

  // Delete Image ---will go to redux
  const handleDelete = async (timestamp: string) => {
    // console.log("timestamp", id);
    setImgLoading(true);
    await app
      .storage()
      // gs://pbc-dev-2022.appspot.com/users/0NLU37RJcLeFlCgrWlcswFwCjok2/attendanceImages
      .ref(`users/${userId}/attendanceImages/${timestamp}`)
      .delete()
      .then(() => {})
      .catch((e: any) => console.log(e.message));

    try {
      if (userId && timestamp) {
        await fetch(
          `https://pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/attendance/${Auth.currentCompany}/${timestamp}/${Auth.userId}.json`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let array = data ? data : [];
        console.log("aa", array);
        var filtered = array.filter(
          (item: any) => item.id !== `${Auth.userId}`
        );
        console.log("bb", filtered);
        setData(filtered);
      }
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }

    setImgLoading(false);
  };

  // Upload XLS
  const uploadXls = async () => {
    // let createDate = new Date();
    // let date = createDate.getDate();
    // let month = createDate.getMonth() + 1;
    // let year = createDate.getFullYear();
    // let newDate = date + "-" + month + "-" + year;

    // let timestamp: string = newDate;

    // const response = await fetch(
    //   `https://pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/attendance/${Auth.currentCompany}/${timestamp}/${Auth.userId}.json`
    // );
    // const resData = await response.json();

    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });
    console.log("vhbhb", wb);
    const uri = FileSystem.cacheDirectory + "attendances.xlsx";
    console.log("hvsdh", uri);
    console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "MyWater data",
      UTI: "com.microsoft.excel.xlsx",
    });
    // to read excel file

    // var ws = XLSX.utils.json_to_sheet(resData);
    // console.log("ggfngffgfhg", ws);
    // var wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, "Prova");

    // const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
    // var RNFS = require("react-native-fs");
    // var file = RNFS.ExternalStorageDirectoryPath + "/test.xlsx";
    // writeFile(file, wbout, "ascii");
  };

  return (
    <ScrollView>
      <VStack alignItems="center">
        <HStack>
          <IconButtonUI
            IconSpec={<Icon as={Entypo} name={"chevron-with-circle-left"} />}
            onSelect={() => {
              let date = currentDate;
              date.setMonth(date.getMonth() - 1);
              setCurrentDate(date);
              setMonth(date.getMonth());
              setYear(date.getFullYear());
            }}
          />
          <Box m="2">
            <Text>
              {year} {monthNames[month]}
            </Text>
          </Box>
          <IconButtonUI
            IconSpec={<Icon as={Entypo} name={"chevron-with-circle-right"} />}
            onSelect={() => {
              let date = currentDate;
              date.setMonth(date.getMonth() + 1);
              setCurrentDate(date);
              setMonth(date.getMonth());
              setYear(date.getFullYear());
            }}
          />
        </HStack>

        <Divider m="4" thickness="2" />

        {/* {presentArray.forEach((employeeA) => {
        employeeA.forEach((data) => {
          console.log(data);
        });
      })} */}

        {data
          ? data.map((item: T) => {
              return (
                <Card key={item.id} m="2">
                  <HStack alignItems="center" justifyContent="space-between">
                    <Image
                      alt={"stuff"}
                      source={{ uri: item.file }}
                      size="xs"
                      m="2"
                    />

                    <Text>{item.address}</Text>
                    {imgLoading ? (
                      <Spinner />
                    ) : (
                      <IconButtonUI
                        IconSpec={<Icon as={MaterialIcons} name={"delete"} />}
                        onSelect={() => {
                          handleDelete(item.timestamp);
                          // console.log("udaygd", data[0].file);
                        }}
                      />
                    )}
                  </HStack>
                </Card>
              );
            })
          : null}

        {!!image && (
          <>
            <HStack alignItems="center" justifyContent="space-between">
              <Image alt={"stuff"} source={{ uri: image }} size="xs" m="2" />

              <Text>{text}</Text>
            </HStack>
            {imgLoading ? (
              <Spinner />
            ) : (
              <HStack>
                {/* <Button onPress={() => handleImageDelete(attendState.id)} m="5">
                  Delete
                </Button> */}
                <Button onPress={onImageUpload} m="5">
                  Confirm
                </Button>
              </HStack>
            )}
          </>
        )}

        <VStack>
          <Button onPress={takePhoto}>
            {!!image ? "Try Again" : "Punch In"}
          </Button>
        </VStack>
        <Button
          onPress={() => {
            uploadXls();
          }}
          m="2"
        >
          Download Excel
        </Button>
      </VStack>
    </ScrollView>
  );
}
