import { useIsFocused } from "@react-navigation/native";
import {
  Box,
  Button,
  FlatList,
  Stack,
  AspectRatio,
  Image,
  Heading,
  HStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

import { get } from "../../APIs/helpers";
import Stars from "../../components/molecules/Star";
import { primary } from "../../constants/Colors";
import { Place } from "../../models/place";
import { signOut } from "../../store/actions/auth";
import { useAppDispatch } from "../../store/selectors/hooks";
import { ResProps } from "../../types";
import { fetchPlaces, insertPlace } from "../../utils/database";
import getCurrentLocation from "../../utils/getCurrentLocation";

export default function RestaurantsScreen({ navigation }: ResProps<"Root">) {
  const isFocused = useIsFocused();
  const [loadedPlaces, setLoadedPlaces] = useState<null | Place[]>(null);
  const [location, setLocation] = useState<null | {
    lat: number;
    lng: number;
  }>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const currLocation = await getCurrentLocation();
      setLocation(currLocation ? currLocation : null);
    })();
  }, []);

  useEffect(() => {
    async function loadPlaces() {
      //Fetch data from database
      const data = await fetchPlaces();
      if (data.length > 0) {
        setLoadedPlaces(data.restaurants);
        // console.log("from db", data.restaurants);
      } else {
        // If database empty fetch it from
        const apiData = await get("restaurants");
        const loadedRestaurants = [];
        for (const key in apiData) {
          const newData = new Place(
            apiData[key].title,
            apiData[key].imageUrl,
            { lat: apiData[key].location.lat, lng: apiData[key].location.lng },
            apiData[key].rating,
            key
          );
          await insertPlace(newData);
          loadedRestaurants.push(newData);
        }
        setLoadedPlaces(loadedRestaurants);
      }
    }

    if (isFocused) {
      loadPlaces();
    }
  }, []);

  return (
    <Box>
      <FlatList
        ListHeaderComponent={
          <Button onPress={() => dispatch(signOut())}>Sign out</Button>
        }
        data={loadedPlaces}
        renderItem={({ item }) => (
          <Box alignItems="center">
            <Box
              minW="80"
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
              mt="2"
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
                mt="3"
                paddingX="2"
              >
                <Box>
                  <AspectRatio w="12" ratio={1 / 1} mb="1">
                    <Image
                      source={{
                        uri: item.imageUrl,
                      }}
                      alt="image"
                      borderRadius="sm"
                    />
                  </AspectRatio>
                </Box>
                <Box>
                  <Stack space={1}>
                    <Heading size="sm" ml="-1" fontFamily="space-mono">
                      {item.title}
                    </Heading>
                    <Stars rate={item.rating} />
                  </Stack>
                </Box>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Maps", {
                      origin: {
                        latitude: location?.lat,
                        longitude: location?.lng,
                      },
                      destination: {
                        latitude: item.location.lat,
                        longitude: item.location.lng,
                      },
                      title: item.title,
                      rating: item.rating,
                    });
                  }}
                >
                  <Box
                    backgroundColor={primary}
                    borderRadius="sm"
                    justifyContent="center"
                    alignItems="center"
                    h="10"
                    w="8"
                  >
                    <Image
                      h="8"
                      w="6"
                      source={require("../../assets/icons/icons/map.png")}
                      alt="image"
                    />
                  </Box>
                </TouchableOpacity>
              </HStack>
            </Box>
          </Box>
        )}
      />
    </Box>
  );
}
