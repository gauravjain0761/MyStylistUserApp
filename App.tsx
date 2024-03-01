import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MainNavigator from "./src/navigation/MainNavigator";
import SplashScreen from "react-native-splash-screen";
import Toast from "react-native-toast-message";

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <MainNavigator />
      <Toast />
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
