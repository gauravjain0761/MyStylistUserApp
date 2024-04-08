import React, { useEffect } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import MainNavigator from "./src/navigation/MainNavigator";
import SplashScreen from "react-native-splash-screen";
import Toast from "react-native-toast-message";
import { colors } from "./src/theme/color";
import { Provider } from "react-redux";
import store from "./src/redux";
import { dispatchNavigation } from "./src/helper/globalFunction";
import { getAsyncToken } from "./src/helper/asyncStorage";
import { screenName } from "./src/helper/routeNames";

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          backgroundColor={colors.white}
          barStyle={"dark-content"}
        />
        <MainNavigator />
        <Toast />
      </View>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
