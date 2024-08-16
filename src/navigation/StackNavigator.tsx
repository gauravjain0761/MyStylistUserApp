import React, { FC, useEffect } from "react";
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
import ChatDetails from "../screen/Chat/ChatDetails";
import MyFavorites from "../screen/Favorite/MyFavorites";
import PrivacyPolicy from "../screen/PrivacyandPolicy/PrivacyPolicy";
import TermsCondition from "../screen/Terms/TermsCondition";
import Loading from "../screen/auth/Loading";
import MapLocation from "../screen/map/MapLocation";
import SelectLocation from "../screen/map/SelectLocation";
import ConfirmAddress from "../screen/map/ConfirmAddress";
import OfferDetails from "../screen/Offer/OfferDetails";
import PackgesDetails from "../screen/Package/PackgesDetails";
import SearchStylistName from "../screen/Search/SearchStylistName";
import StylistDetails from "../screen/Details/StylistDetails";
import StylistList from "../screen/Home/StylistList";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { messagesRead } from "../actions";
import { useAppDispatch } from "../redux/hooks";

const options: NativeStackNavigationOptions = {
  headerShown: false,
  animation: "none",
};

const Stack = createNativeStackNavigator();

const StackNavigator: FC = () => {
  const navigation = useNavigation();
  useEffect(() => {
    getNotification();
  }, []);
  const dispatch = useAppDispatch();

  const getNotification = async () => {
    await messaging()
      ?.getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          CheckNotification(remoteMessage);
        }
      });
    messaging()?.onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage) {
        CheckNotification(remoteMessage);
      }
    });
  };

  const CheckNotification = (remoteMessage: any) => {
    let type = remoteMessage?.data?.action;
    if (type == "CHAT_DETAILS") {
      messagesReads(remoteMessage?.data?.value);
      navigation.navigate(screenName.ChatDetails, {
        roomId: remoteMessage?.data?.value,
        receiverId: remoteMessage?.data?.user_id,
        receiverImage: remoteMessage?.data?.user_image,
        device_token: remoteMessage?.data?.device_token,
        name: remoteMessage?.data?.name,
      });
    }
  };

  const messagesReads = async (item: string) => {
    const obj = {
      data: {
        messageId: item,
      },
      onSuccess: (Res: any) => {},
      onFailure: (Err: any) => {
        console.log("Errr", Err);
      },
    };
    dispatch(messagesRead(obj));
  };

  return (
    <Stack.Navigator
      screenOptions={options}
      initialRouteName={screenName.Loading}
    >
      <Stack.Screen name={screenName.Loading} component={Loading} />
      <Stack.Screen name={screenName.Login} component={Login} />
      <Stack.Screen
        name={screenName.OptVerification}
        component={OtpVerification}
      />
      <Stack.Screen name={screenName.Home} component={DrawerNavigator} />
      <Stack.Screen name={"StylistList"} component={StylistList} />
      <Stack.Screen name={"StylistDetails"} component={StylistDetails} />
      <Stack.Screen name={screenName.YourStylist} component={YourStylist} />
      <Stack.Screen name={screenName.Cart} component={Cart} />
      <Stack.Screen name={screenName.Service} component={Service} />
      <Stack.Screen name={screenName.NewYearOffer} component={NewYearOffer} />
      <Stack.Screen name={screenName.OfferDetails} component={OfferDetails} />
      <Stack.Screen
        name={screenName.PackgesDetails}
        component={PackgesDetails}
      />
      <Stack.Screen
        name={screenName.AppointmentDetails}
        component={AppointmentDetails}
      />
      <Stack.Screen name={screenName.SearchItem} component={SearchItem} />
      <Stack.Screen
        name={screenName.SearchStylistName}
        component={SearchStylistName}
      />
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
      <Stack.Screen name={screenName.ChatDetails} component={ChatDetails} />
      <Stack.Screen name={screenName.MyFavorites} component={MyFavorites} />
      <Stack.Screen name={screenName.PrivacyPolicy} component={PrivacyPolicy} />
      <Stack.Screen
        name={screenName.TermsCondition}
        component={TermsCondition}
      />
      <Stack.Screen name={screenName.Map_Location} component={MapLocation} />
      <Stack.Screen
        name={screenName.SelectLocation}
        component={SelectLocation}
      />
      <Stack.Screen
        name={screenName.ConfirmAddress}
        component={ConfirmAddress}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
