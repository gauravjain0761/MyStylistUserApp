import AsyncStorage from "@react-native-async-storage/async-storage";

export const asyncKeys = {
  // clear in logout time
  token: "@token",
  refreshToken: "@refreshToken",
  user_info: "@user_info",
  notifiaction_data: "@notifiaction_data",
  search_user_list: "@search_user_list",
  // no clear in logout time
  guest: "@guest",
  location: "@location",
  Coord: "@coord",
  cartId: "@cart_id",
  device_token: "@device_token",
  isAddressed: "@is_addressed",
  defaultLatLng: "@default_lat_lng",
};

export const clearAsync = async () => {
  await AsyncStorage.multiRemove([
    asyncKeys.token,
    asyncKeys.user_info,
    asyncKeys.notifiaction_data,
    asyncKeys.location,
    asyncKeys.cartId,
    asyncKeys.isAddressed,
    asyncKeys.device_token,
    asyncKeys.cartId,
    asyncKeys.defaultLatLng,
    asyncKeys.refreshToken,
  ]);
};

export const setAsyncRefreshToken = async (token: string) => {
  await AsyncStorage.setItem(asyncKeys.refreshToken, JSON.stringify(token));
};

export const getAsyncRefreshToken = async () => {
  const token = await AsyncStorage.getItem(asyncKeys.refreshToken);
  if (token) {
    return JSON.parse(token);
  }
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

export const setAsyncCartId = async (user: any) => {
  await AsyncStorage.setItem(asyncKeys.cartId, JSON.stringify(user));
};

export const getAsyncCartId = async () => {
  const cartId = await AsyncStorage.getItem(asyncKeys.cartId);
  if (cartId) {
    return JSON.parse(cartId);
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

export const setAsyncSearchUserList = async (data: any) => {
  await AsyncStorage.setItem(asyncKeys.search_user_list, JSON.stringify(data));
};

export const getAsyncSearchUserList = async () => {
  const userList = await AsyncStorage.getItem(asyncKeys.search_user_list);
  if (userList) {
    return JSON.parse(userList) || [];
  } else {
    return [];
  }
};

export const setAsyncDevice_token = async (token: any) => {
  await AsyncStorage.setItem(asyncKeys.device_token, JSON.stringify(token));
};

export const getAsyncDevice_token = async () => {
  const device_token = await AsyncStorage.getItem(asyncKeys.device_token);
  if (device_token) {
    return device_token;
  } else {
    return null;
  }
};

export const setAsyncIsAddressed = async (data: any) => {
  await AsyncStorage.setItem(asyncKeys.isAddressed, JSON.stringify(data));
};

export const getAsyncIsAddressed = async () => {
  const isAddressed = await AsyncStorage.getItem(asyncKeys.isAddressed);
  if (isAddressed) {
    return JSON.parse(isAddressed);
  } else {
    return null;
  }
};

export const setAsyncDefaultLatLng = async (data: any) => {
  await AsyncStorage.setItem(asyncKeys.defaultLatLng, JSON.stringify(data));
};

export const getAsyncDefaultLatLng = async () => {
  const data = await AsyncStorage.getItem(asyncKeys.defaultLatLng);
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
};
