import React from "react";
import { Dimensions, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { navigationRef } from "../navigation/MainNavigator";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import moment from "moment";
import ImagePicker from "react-native-image-crop-picker";

export const screen_width: number = Dimensions.get("window").width;
export const screen_height: number = Dimensions.get("window").height;

export const wp = (val: number) => {
  return widthPercentageToDP((val * 100) / 375);
};

export const hp = (val: number) => {
  return heightPercentageToDP((val * 100) / 812);
};

export const fontSize = (val: number) => RFValue(val, 812);

export const isIos = Platform.OS === "ios";

export const dispatchNavigation = (name: string, params?: any) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: name, params: params }],
    })
  );
};

export const infoToast = (message: string) => {
  Toast.show({ type: "info", text1: message });
};
export const errorToast = (message: string) => {
  Toast.show({ type: "error", text1: message });
};

export const otpToast = (message: string) => {
  Toast.show({ type: "otp_success", text1: message });
};

export const successToast = (message: string) => {
  Toast.show({ type: "success", text1: message });
};

export function validPhonenumber(inputtxt: any) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (inputtxt?.match(phoneno)) {
    return true;
  } else {
    return false;
  }
}

export const generateWeekDates = () => {
  const currentDate = moment();
  const datesArray = [];

  for (let i = 0; i < 7; i++) {
    datesArray.push({ id: i + 1, date: currentDate.clone().format() }); // You can format the date as needed
    currentDate.add(1, "day");
  }
  return datesArray;
};

export const generateTimes = () => {
  let timesArray = [];
  const morningTime = moment().startOf("day").add(10, "hours");
  const nightTime = moment().startOf("day").add(21, "hours");
  let Id = 0;
  let currentTime = morningTime.clone();
  while (currentTime.isSameOrBefore(nightTime)) {
    timesArray.push({
      id: Id,
      time: currentTime.format("hh:mm A"),
    });
    currentTime.add(1, "hours");
    Id++;
  }
  return timesArray;
};

export const hitSlop = { top: 10, left: 10, bottom: 10, right: 10 };

export type ImagePickerProps = {
  params?: object;
  onSucess: (params: object) => void;
  onFail?: (params: { message: string }) => void | undefined;
};
export const openImagePicker = ({
  params,
  onSucess,
  onFail,
}: ImagePickerProps) => {
  try {
    ImagePicker.openPicker({
      multiple: false,
      cropping: true,
      mediaType: "photo",
      freeStyleCropEnabled: true,
      ...params,
    })
      .then((image) => {
        let obj = {
          ...image,
          uri: image.path,
          name: "image_" + moment().unix() + "_" + image.path.split("/").pop(),
        };
        onSucess(obj);
      })
      .catch((err) => {
        onFail?.(err);
      });
  } catch (error) {}
};

export const formatWorkingHours = (workingHoursData: any) => {
  const formattedHours: any = [];

  // Loop through each day
  for (const day in workingHoursData?.[0]) {
    if (day !== "_id") {
      formattedHours.push({
        day,
        open: workingHoursData[0][day].open,
        from: workingHoursData[0][day].from,
        to: workingHoursData[0][day].to,
      });
    }
  }

  return formattedHours;
};

export const formatData = (data: any) => {
  const formattedOutput: any = [];

  for (const key in data) {
    if (key !== "_id") {
      formattedOutput.push({
        title: key,
        value: data[key],
      });
    }
  }

  return formattedOutput;
};

export const convertStringToTitle = (str: string) => {
  // Split the string by underscore and capitalize each word
  const words = str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  // Join the words with space
  return words.join(" ");
};

export function convertToOutput(input: any) {
  const output: any = [];

  for (const [date, values] of Object.entries(input)) {
    output.push({
      title: date,
      value: values,
    });
  }

  return output;
}

// Helper function to check if the user has scrolled to the bottom
export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};
