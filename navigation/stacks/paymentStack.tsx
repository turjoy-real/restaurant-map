import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PaymentScreen from "../../screens/PaymentScreen/PaymentScreen";

const PaymentStack = createNativeStackNavigator();

export default function PaymentStackNavigator() {
  return (
    <PaymentStack.Navigator>
      <PaymentStack.Screen
        name="payment"
        component={PaymentScreen}
        options={{
          title: "Payment",
        }}
      />
    </PaymentStack.Navigator>
  );
}
