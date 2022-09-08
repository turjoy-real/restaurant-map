import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../../screens/SettingsScreen/SettingsScreen";

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
    </SettingsStack.Navigator>
  );
}
