import React from 'react';
import {Dimensions, Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {navigationRef} from '../navigation/MainNavigator';
import {CommonActions} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export const screen_width: number = Dimensions.get('window').width;
export const screen_height: number = Dimensions.get('window').height;

export const wp = (val: number) => {
  return widthPercentageToDP((val * 100) / 375);
};

export const hp = (val: number) => {
  return heightPercentageToDP((val * 100) / 812);
};

export const fontSize = (val: number) => RFValue(val, 812);

export const isIos = Platform.OS === 'ios';

export const dispatchNavigation = (name: string, params?: any) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{name: name, params: params}],
    }),
  );
};

export const infoToast = (message: string) => {
  Toast.show({type: 'info', text1: message});
};
export const errorToast = (message: string) => {
  Toast.show({type: 'error', text1: message});
};

export const otpToast = (message: string) => {
  Toast.show({type: 'otp_success', text1: message});
};

export const successToast = (message: string) => {
  Toast.show({type: 'success', text1: message});
};

export function validPhonenumber(inputtxt: any) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (inputtxt?.match(phoneno)) {
    return true;
  } else {
    return false;
  }
}
