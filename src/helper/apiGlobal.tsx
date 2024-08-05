import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./apiConstants";
import { screenName } from "./routeNames";
import { navigationRef } from "../navigation/MainNavigator";
import { dispatchNavigation, errorToast } from "./globalFunction";
import { clearAsync } from "./asyncStorage";
import { Alert } from "react-native";

interface makeAPIRequestProps {
  method?: any;
  url?: any;
  data?: any;
  headers?: any;
  params?: any;
}

const apiClient = axios.create({
  baseURL: api.BASE_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${api.BASE_URL}`, {
      refreshToken,
    });

    const { accessToken } = response.data;
    await AsyncStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    clearAsync();
    navigationRef?.current?.reset({
      index: 1,
      routes: [{ name: screenName.Login }],
    });
    throw error;
  }
};

export const makeAPIRequest = ({
  method,
  url,
  data,
  headers,
  params,
}: makeAPIRequestProps) =>
  new Promise((resolve, reject) => {
    const option = {
      method,
      baseURL: api.BASE_URL,
      url,
      data,
      headers,
      params,
    };
    axios(option)
      .then((response) => {
        // console.log("response-->", response);
        if (response.status === 200 || response.status === 201) {
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        console.log("error?.response?", error?.response);
        if (error?.response?.status === 401) {
          clearAsync();
          errorToast(error?.response?.data?.message);
          navigationRef?.current?.reset({
            index: 1,
            routes: [{ name: screenName.Login }],
          });
        } else {
          // errorToast(error?.response?.data?.message);
        }
        reject(error);
      });
  });
