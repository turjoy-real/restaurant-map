import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AttendanceScreen from "../../screens/AttendanceScreen/AttendanceScreen";
import useAuthData from "../../store/selectors/auth";
import useCompanyData from "../../store/selectors/company";

const AttendanceStack = createNativeStackNavigator();

export default function attendanceStackNavigator() {
  const company = useCompanyData();

  const currentCompanyName: string = company?.data?.companyName
    ? company.data.companyName
    : null;

  // console.log("currentCompanyName", currentCompanyName);

  return (
    <AttendanceStack.Navigator>
      <AttendanceStack.Screen
        name="attendance"
        component={AttendanceScreen}
        options={{
          title: currentCompanyName,
        }}
      />
    </AttendanceStack.Navigator>
  );
}
