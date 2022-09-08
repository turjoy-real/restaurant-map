/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { DrawerScreenProps } from "@react-navigation/drawer";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { extendTheme } from "native-base";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootDrawerParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  // ProfileScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

// Drawer Navigation Types

export type RootDrawerParamList = {
  // TabOne: undefined;
  // TabTwo: undefined;

  "leave templates": undefined;
  LoginOne: undefined;
  LoginTwo: undefined;
  RegOne: undefined;
  RegTwo: undefined;
  Attendance: undefined;
  Payment: undefined;
  Settings: undefined;
};

// export type ProfileRouteProp = RootTabScreenProps<RootDrawerParamList, "Profile">;

export type RootDrawerScreenProps<Screen extends keyof RootDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

// To enable typescript with native base

const customTheme = extendTheme({
  space: {
    "space-2": "29px",
  },
  components: {
    Button: {
      variants: {
        brand: {
          p: "10",
          bg: "grey",
        },
      },
    },
  },
});

// 2. Get the type of the CustomTheme
type CustomThemeType = typeof customTheme;

// 3. Extend the internal NativeBase Theme
declare module "native-base" {
  interface ICustomTheme extends CustomThemeType {}
}

export interface Error {
  error: boolean;
  errorMessage: string;
}
