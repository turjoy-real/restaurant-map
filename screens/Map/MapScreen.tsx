import { StatusBar } from "expo-status-bar";
import {
  AspectRatio,
  Box,
  Card,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from "native-base";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { View } from "../../components/Themed";
import Stars from "../../components/molecules/Star";
import { ResProps } from "../../types";

const GOOGLE_MAPS_APIKEY = "AIzaSyBA9Rb1CmQ5k0YiBgdPfGa9iUNGtqfn0EI";

export default function MapScreen({ route }: ResProps<"Root">) {
  console.log("ggg", route.params);

  const origin = route.params.origin;
  const destination = route.params.destination;
  const title = route.params.title;
  const rating = route.params.rating;
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
        /> */}

        {/* User Marker  */}
        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
        />

        {/* Shop Marker  */}
        <Marker
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
        >
          <Box>
            <Box
              // minW="80"
              rounded="lg"
              overflow="hidden"
              borderColor="coolGray.200"
              borderWidth="1"
              _dark={{
                borderColor: "coolGray.600",
                backgroundColor: "gray.700",
              }}
              _web={{
                shadow: 2,
                borderWidth: 0,
              }}
              _light={{
                backgroundColor: "gray.50",
              }}
              h="20"
              m="2"
            >
              <HStack
                justifyContent="center"
                alignItems="center"
                mt="3"
                paddingX="2"
              >
                <Box>
                  <AspectRatio w="12" ratio={1 / 1}>
                    <Image
                      w="10"
                      h="10"
                      source={require("../../assets/icons/icons/map-img.png")}
                      alt="image"
                      borderRadius="sm"
                    />
                  </AspectRatio>
                </Box>
                <Box>
                  <Stack space={1}>
                    <Heading size="xs" ml="-1" fontFamily="space-mono">
                      {title}
                    </Heading>
                    <Stars rate={rating} />
                  </Stack>
                </Box>
              </HStack>
            </Box>
            <AspectRatio w="12" ratio={1 / 1} mb="1">
              <Image
                w="8"
                h="10"
                source={require("../../assets/icons/icons/shop-pin.png")}
                alt="image"
                borderRadius="sm"
              />
            </AspectRatio>
          </Box>
        </Marker>
      </MapView>

      {/* <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      /> */}
      {/* <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
        />
      </MapView> */}
    </View>
    // </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
