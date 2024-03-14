import AsyncStorage from "@react-native-async-storage/async-storage";

export const asyncKeys = {
  // clear in logout time
  token: "@token",
  user_info: "@user_info",
  notifiaction_data: "@notifiaction_data",
  // no clear in logout time
  guest: "@guest",
  location: "@location",
  Coord: "@coord",
};

export const clearAsync = async () => {
  await AsyncStorage.multiRemove([
    asyncKeys.token,
    asyncKeys.user_info,
    asyncKeys.notifiaction_data,
  ]);
};

export const setAsyncToken = async (token: string) => {
  await AsyncStorage.setItem(asyncKeys.token, JSON.stringify(token));
};

export const getAsyncToken = async () => {
  const token = await AsyncStorage.getItem(asyncKeys.token);
  if (token) {
    return "Bearer " + JSON.parse(token);
  } else {
    return null;
  }
};

export const setAsyncGuest = async (value: boolean) => {
  await AsyncStorage.setItem(asyncKeys.guest, JSON.stringify(value));
};

export const getAsyncIsGuestUser = async () => {
  const isGuestUser: any = await AsyncStorage.getItem(asyncKeys.guest);
  if (JSON.parse(isGuestUser) === true || isGuestUser === null) {
    return true;
  } else {
    return false;
  }
};

export const setAsyncUserInfo = async (user: any) => {
  await AsyncStorage.setItem(asyncKeys.user_info, JSON.stringify(user));
};

export const getAsyncUserInfo = async () => {
  const userInfo = await AsyncStorage.getItem(asyncKeys.user_info);
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return null;
  }
};

export const setAsyncLocation = async (location: any) => {
  await AsyncStorage.setItem(asyncKeys.location, JSON.stringify(location));
};

export const getAsyncLocation = async () => {
  const userlocation = await AsyncStorage.getItem(asyncKeys.location);
  if (userlocation) {
    return JSON.parse(userlocation);
  } else {
    return null;
  }
};

export const setAsyncCoord = async (location: any) => {
  await AsyncStorage.setItem(asyncKeys.Coord, JSON.stringify(location));
};

export const getAsyncCoord = async () => {
  const locationCoord = await AsyncStorage.getItem(asyncKeys.Coord);
  if (locationCoord) {
    return JSON.parse(locationCoord);
  } else {
    return null;
  }
};
