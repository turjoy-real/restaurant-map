import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { extendTheme } from "native-base";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootParamList> | undefined;
  LoginOne: NavigatorScreenParams<AuthParamList> | undefined;
};

export type AuthParamList = {
  Login: undefined;
};

export type RootParamList = {
  Restaurants: undefined;
  Maps: {
    data: {
      origin: {
        latitude: number;
        longitude: number;
      };
      destination: {
        latitude: number;
        longitude: number;
      };
      title: string,
      rating: number
    };
  };
};

export type ResProps = NativeStackScreenProps<RootStackParamList, "Root">;

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

export interface Place {
  title: string;
  imageUrl: string;
  location: { lat: number; lng: number };
  id: string;
  rating: number;
}
