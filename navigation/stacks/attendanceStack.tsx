import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AttendanceScreen from "../../screens/AttendanceScreen/AttendanceScreen";

const AttendanceStack = createNativeStackNavigator();

export default function attendanceStackNavigator() {
  return (
    <AttendanceStack.Navigator>
      <AttendanceStack.Screen
        name="attendance"
        component={AttendanceScreen}
        options={{
          title: "Attendance",
        }}
      />
    </AttendanceStack.Navigator>
  );
}
