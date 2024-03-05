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
import Cart from "../screen/Cart";
import Service from "../screen/Service/Service";
import DrawerNavigator from "./DrawerNavigator";
import { Appointment } from "../theme/SvgIcon";
import AppointmentDetails from "../screen/Appointment/AppointmentDetails";
import NewYearOffer from "../screen/Offer/NewYearOffer";

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
      <Stack.Screen name={screenName.Home} component={DrawerNavigator} />
      <Stack.Screen name={screenName.YourStylist} component={YourStylist} />
      <Stack.Screen name={screenName.Cart} component={Cart} />
      <Stack.Screen name={screenName.Service} component={Service} />
      <Stack.Screen name={screenName.NewYearOffer} component={NewYearOffer} />
      <Stack.Screen
        name={screenName.appointmentDetails}
        component={AppointmentDetails}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
