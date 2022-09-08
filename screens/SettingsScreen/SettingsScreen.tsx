import { StatusBar } from "expo-status-bar";
import { Box, Text } from "native-base";
import React from "react";

export default function SettingsScreen() {
  return (
    <Box>
      <Text>Settings</Text>
      <StatusBar style="auto" />
    </Box>
  );
}
