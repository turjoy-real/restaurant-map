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
} from "native-base";
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
  // Attendance image
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
  const [image, setImage] = useState("");
  const [location, setLocation] = useState<any | null>(null);
  const [address, setAddress] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<any | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  type T = typeof attendState;

  const [data, setData] = useState<any>();
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

  // useEffect(() => {
  //   setMonth(currentDate.getMonth());
  //   setYear(currentDate.getFullYear());
  //   console.log(month, year);
  // }, [currentDate]);

  // Current Year and month

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

  // Fetch Attendance summary for a month
  useEffect(() => {
    async function getAttendances() {
      const response = await fetch(
        `https://pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/attendance/${Auth.currentCompany}/${Auth.userId}`
      );
      const resData = await response.json();

      let arr: T[] = [];

      for (const key in resData) {
        arr.push({
          id: key,
          title: resData[key].title,
          file: resData[key].file,
          author: resData[key].author,
          timestamp: resData[key].timestamp,
          approved: resData[key].approved,
          address: resData[key].address,
          location: resData[key].location,
          present: resData[key].present,
        });
      }

      setData(arr);
    }

    getAttendances();
  });

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

      // ---will go to redux

      if (userId && timestamp) {
        const response = await fetch(
          `https://pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/attendance/${Auth.currentCompany}/${userId}/${timestamp}.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: Auth.userId ? "ABC" : "Null",
              file: fileLink,
              author: Auth.userId ? Auth.fullName : "Null",
              timestamp,
              approved: false,
              address: text,
              location,
              present: false,
            }),
          }
        );

        const res = await response.json();

        setAttendState({
          title: Auth.userId ? "ABC" : "Null",
          file: fileLink,
          author: Auth.userId ? Auth.fullName : "Null",
          timestamp,
          approved: false,
          location,
          present: false,
          id: res.name,
          address: text,
        });

        let arr: T[] = [...data];

        arr.push({
          title: Auth.userId ? "ABC" : "Null",
          file: fileLink,
          author: Auth.userId ? Auth.fullName : "Null",
          timestamp,
          approved: false,
          location,
          present: false,
          id: res.name,
          address: text,
        });

        setData(arr);
        setImage("");
        setAddress("");

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
  const handleImageDelete = async (id: string) => {
    let timestamp: string = attendState.timestamp;
    console.log("timestamp", timestamp);
    await app
      .storage()
      // gs://pbc-dev-2022.appspot.com/users/OnZNOpuoO4S7TZsT3tlHOv3bMtA2/attendanceImages
      .ref(`users/${userId}/attendanceImages/${timestamp}/`)
      .delete()
      .then(() => {})
      .catch((e: any) => console.log(e.message));

    if (userId && timestamp) {
      await fetch(
        `https://pbc-dev-2022-default-rtdb.asia-southeast1.firebasedatabase.app/attendance/${userId}/${timestamp}/${id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setAttendState({
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
    }
  };

  // Present, absent, overtimr array

  // const presentArray = [
  //   ["Present", "Absent", "Half Day"],
  //   ["Leave", "Late Fine", "Overtime"],
  // ];

  return (
    <VStack alignItems="center">
      <HStack>
        <IconButton
          icon={<Icon as={Entypo} name={"chevron-with-circle-left"} />}
          borderRadius="full"
          _icon={{
            color: "muted.700",
            size: "md",
          }}
          _hover={{
            bg: "coolGray.800:alpha.20",
          }}
          // _pressed={{
          //   bg: 'coolGray.800:alpha.20',
          // }}
          onPress={() => {
            let date = currentDate;
            date.setMonth(date.getMonth() - 1);
            setCurrentDate(date);
            setMonth(date.getMonth());
            setYear(date.getFullYear());
          }}
        />
        {/* <IconButtonUI
          IconSpec={<Icon as={Entypo} name={"chevron-with-circle-left"} />}
          onSelect={() => {
            let date = currentDate;
            date.setMonth(date.getMonth() - 1);
            setCurrentDate(date);
            console.log("pressed", date);
          }}
        /> */}
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
              <Card>
                <HStack alignItems="center" justifyContent="space-between">
                  <Image
                    alt={"stuff"}
                    source={{ uri: item.file }}
                    size="xs"
                    m="2"
                  />

                  <Text>{item.address}</Text>
                  <IconButtonUI
                    IconSpec={<Icon as={MaterialIcons} name={"delete"} />}
                    onSelect={() => {
                      let date = currentDate;
                      date.setMonth(date.getMonth() + 1);
                      setCurrentDate(date);
                      setMonth(date.getMonth());
                      setYear(date.getFullYear());
                    }}
                  />
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
              <Button onPress={() => handleImageDelete(attendState.id)} m="5">
                Delete
              </Button>
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
    </VStack>
  );
}
