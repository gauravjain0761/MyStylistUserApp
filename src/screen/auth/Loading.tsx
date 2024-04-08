import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { getAsyncToken } from "../../helper/asyncStorage";
import {
  dispatchNavigation,
  screen_height,
  screen_width,
} from "../../helper/globalFunction";
import { screenName } from "../../helper/routeNames";

const Loading = () => {
  useEffect(() => {
    isLogin();
  }, []);

  const isLogin = async () => {
    const token = await getAsyncToken();
    if (token) {
      dispatchNavigation(screenName.Home);
    } else {
      dispatchNavigation(screenName.Login);
    }
  };
  return (
    <View style={styles.containerStyle}>
      <ImageBackground
        source={require("../../assets/image/launch_screen.png")}
        style={styles.backgroundStyle}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  backgroundStyle: {
    height: screen_height,
    width: screen_width,
  },
});
