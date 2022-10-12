import * as Location from "expo-location";

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    // setErrorMsg("Permission to access location was denied");
    return;
  }
  const location = await Location.getCurrentPositionAsync({ accuracy: 3 });

  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
}

export default getCurrentLocation;
