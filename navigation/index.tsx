import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import app from "firebase/compat/app";
import "firebase/compat/auth";
import { Box, Button, Text } from "native-base";
import * as React from "react";
// eslint-disable-next-line
import { ColorSchemeName, useWindowDimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginOne from "../screens/LoginScreens/LoginOne/LoginOne.screen";
import LoginTwo from "../screens/LoginScreens/LoginTwo/LoginTwo.screen";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";

import StartupScreen from "../screens/StartUpScreen/StartUp.screen";
import { fetchUser, signOut } from "../store/actions/auth";
import { fetchProfile } from "../store/actions/companyProfile";
import useAuthData from "../store/selectors/auth";
import useCompanyData from "../store/selectors/company";
import { useAppDispatch } from "../store/selectors/hooks";
import { RootDrawerParamList, RootStackParamList } from "../types";

import { FontAwesome5 } from "@expo/vector-icons";

import attendanceStackNavigator from "./stacks/attendanceStack";
import PaymentStackNavigator from "./stacks/paymentStack";
import SettingsStackNavigator from "./stacks/settingsStack";
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const { token, didTryAutoLogin, currentCompany } = useAuthData();
  const { id } = useCompanyData();
  const company = useCompanyData();
  const isAuth = !!token;
  const isReg = !!id;

  const dispatch = useAppDispatch();
  const Auth = useAuthData();
  React.useEffect(() => {
    app.auth().onAuthStateChanged(async (user) => {
      console.log("fetching", user?.uid, !!user, company);

      const obj = {
        userId: "",
        token: "",
      };

      if (user) {
        const userId = user?.uid;
        const token = await user?.getIdToken();

        obj.userId = userId;
        obj.token = token;

        // //set auth persistence
        // app
        //   .auth()
        //   .setPersistence(app.auth.Auth.Persistence.LOCAL)
        //   .then(function () {
        //     console.log("successfully set the persistence");
        //     return dispatch(fetchUser(obj));
        //   })
        //   .catch(function (error) {
        //     console.log("failed to ser persistence: " + error.message);
        //   });
      }

      return dispatch(fetchUser(obj));
    });
  }, [Auth.userId]);

  React.useEffect(() => {
    if (currentCompany) {
      dispatch(fetchProfile());
    }
  }, [currentCompany]);

  console.log("isAuth", isAuth, "isReg", isReg);

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

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

// AuthStack
const AuthStack = createNativeStackNavigator<RootDrawerParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="LoginOne" component={LoginOne} />
      {/* <AuthStack.Screen name="LoginTwo" component={LoginTwo} /> */}
    </AuthStack.Navigator>
  );
}

//RegStack
// const RegStack = createNativeStackNavigator<RootDrawerParamList>();

// function RegNavigator() {
//   const { data } = useCompanyData();
//   const { currentCompany } = useAuthData();
//   return (
//     <RegStack.Navigator>
//       {!currentCompany && !data && (
//         <RegStack.Screen name="RegOne" component={RegOne} />
//       )}
//       {currentCompany && !data && (
//         <RegStack.Screen name="RegTwo" component={RegTwo} />
//       )}
//     </RegStack.Navigator>
//   );
// }

// Tab navigation

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  // const dispatch = useAppDispatch();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Attendance"
        component={attendanceStackNavigator}
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="user-tie" size={24} color="#16A5A3" />
          ),
        }}
      />
      <Tab.Screen
        name="Payment"
        component={PaymentStackNavigator}
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="id-card" size={26} color="#16A5A3" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="id-card" size={26} color="#16A5A3" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
