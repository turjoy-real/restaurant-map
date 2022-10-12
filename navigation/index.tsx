import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import app from "firebase/compat/app";
import "firebase/compat/auth";
import * as React from "react";
// eslint-disable-next-line
import { ColorSchemeName, useWindowDimensions } from "react-native";

import { primary } from "../constants/Colors";
import LoginOne from "../screens/LoginScreens/LoginOne/LoginOne.screen";
import StartupScreen from "../screens/StartUpScreen/StartUp.screen";
import { fetchUser, signOut } from "../store/actions/auth";
import useAuthData from "../store/selectors/auth";
import { useAppDispatch } from "../store/selectors/hooks";
import {
  AuthStackParamList,
  RootParamList,
  RootStackParamList,
} from "../types";

import RestaurantsScreen from "../screens/Restaurants/Restaurants";
import MapScreen from "../screens/Map/MapScreen";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: primary,
  },

  headerTitleStyle: {
    fontFamily: "space-mono",
    paddingLeft: 30,
  },
  headerBackTitleStyle: {
    fontFamily: "space-mono",
  },
  headerTintColor: "white",
};

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const { token, didTryAutoLogin } = useAuthData();

  const isAuth = !!token;


  const dispatch = useAppDispatch();
  const Auth = useAuthData();
  // console.log("Auth", Auth);
  

  // Handle user state changes and passing email of active user in redux
  React.useEffect(() => {
    const subscriber = app.auth().onAuthStateChanged(async (user) => {
      const obj: {
        userId: null | string,
        token: null | string,
      } = {
        userId: null,
        token: null,
      };

      if (user) {
        const userId = user?.uid;
        const token = await user?.getIdToken();

        obj.userId = userId;
        obj.token = token;
      }      
      return dispatch(fetchUser(obj));
    });

    return subscriber;
  }, [Auth.userId]);

  console.log("isAuth", isAuth, "isTry", didTryAutoLogin);

  return (
    <NavigationContainer
      // linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {isAuth && didTryAutoLogin && <RootNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
    </NavigationContainer>
  );
}


// AuthStack
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginOne} />
    </AuthStack.Navigator>
  );
}

// RootStack
const RootStack = createNativeStackNavigator<RootParamList>();

function RootNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Restaurants"
      screenOptions={defaultNavOptions}
    >
      <RootStack.Screen
        name="Restaurants"
        component={RestaurantsScreen}
        options={{
          title: "Restaurant List",
          headerTitleAlign: "center",
        }}
      />
      <RootStack.Screen
        name="Maps"
        component={MapScreen}
        options={{
          title: "Maps",
          headerTitleAlign: "center",
        }}
      />
    </RootStack.Navigator>
  );
}