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
import SearchItem from "../screen/Search/SearchItem";
import ImageDetails from "../screen/Search/ImageDetails";
import Notifications from "../screen/Notification/Notifications";
import AppointmentReschedule from "../screen/Appointment/AppointmentReschedule";
import AppointmentCancellation from "../screen/Appointment/AppointmentCancellation";
import AppointmentBookAgain from "../screen/Appointment/AppointmentConfirm";
import Feedback from "../components/common/Feedback";
import Profile from "../screen/Profiles/Profile";
import FaQ from "../screen/Faq/FaQ";

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
        name={screenName.AppointmentDetails}
        component={AppointmentDetails}
      />
      <Stack.Screen name={screenName.SearchItem} component={SearchItem} />
      <Stack.Screen name={screenName.ImageDetails} component={ImageDetails} />
      <Stack.Screen name={screenName.Notifications} component={Notifications} />
      <Stack.Screen
        name={screenName.AppointmentReschedule}
        component={AppointmentReschedule}
      />
      <Stack.Screen
        name={screenName.AppointmentCancellation}
        component={AppointmentCancellation}
      />
      <Stack.Screen
        name={screenName.AppointmentConfirm}
        component={AppointmentBookAgain}
      />
      <Stack.Screen name={screenName.Feedback} component={Feedback} />
      <Stack.Screen name={screenName.Profile} component={Profile} />
      <Stack.Screen name={screenName.FaQ} component={FaQ} />
    </Stack.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
