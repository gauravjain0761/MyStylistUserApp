import React, { FC } from "react";
import { StyleSheet } from "react-native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Login from "../screen/auth/Login";
import Home from "../screen/Home/Home";
import OtpVerification from "../screen/auth/OtpVerification";
import { screenName } from "../helper/routeNames";
import YourStylist from "../screen/Details/YourStylist";

const options: NativeStackNavigationOptions = {
  headerShown: false,
  animation: "slide_from_bottom",
  animationDuration: 500,
  // headerStyle: {
  //   backgroundColor: 'transparent',
  // },
};

const Stack = createNativeStackNavigator();

const StackNavigator: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={options}
      initialRouteName={screenName.Login}
    >
      <Stack.Screen name={screenName.Login} component={Login} />
      <Stack.Screen
        name={screenName.OptVerification}
        component={OtpVerification}
      />
      <Stack.Screen name={screenName.Home} component={Home} />
      <Stack.Screen name={screenName.YourStylist} component={YourStylist} />
    </Stack.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
