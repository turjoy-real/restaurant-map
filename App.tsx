// import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, extendTheme } from "native-base";
// import { useEffect } from "react";
import { Provider } from "react-redux";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import store from "./store/index";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}

// const db = SQLite.openDatabase("places.db");

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  // useEffect(() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       `CREATE TABLE IF NOT EXISTS places (
  //                   id INTEGER PRIMARY KEY NOT NULL,
  //                   title TEXT NOT NULL,
  //                   imageURL TEXT NOT NULL,
  //                   lat REAL NOT NULL
  //                   long REAL NOT NULL
  //               )`
  //     );
  //   });
  // }, []);

  // Set the key-value pairs for the different languages you want to support.

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      // <SafeAreaProvider>
      <NativeBaseProvider>
        <Provider store={store}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </Provider>
      </NativeBaseProvider>
      // </SafeAreaProvider>
    );
  }
}
