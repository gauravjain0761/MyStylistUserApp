import React, { useEffect } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import MainNavigator from "./src/navigation/MainNavigator";
import SplashScreen from "react-native-splash-screen";
import Toast from "react-native-toast-message";
import { colors } from "./src/theme/color";

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        animated={true}
        backgroundColor={colors.white}
        barStyle={"dark-content"}
      />
      <MainNavigator />
      <Toast />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
