import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { colors } from "../../theme/color";
import { getAsyncToken } from "../../helper/asyncStorage";
import { dispatchNavigation } from "../../helper/globalFunction";
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
      <ActivityIndicator size={"large"} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
  },
});
