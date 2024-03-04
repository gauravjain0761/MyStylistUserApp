import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { screenName } from "../helper/routeNames";
import Home from "../screen/Home/Home";
import CustomDrawer from "../components/common/CustomDrawer";
import StackNavigator from "./StackNavigator";

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name={screenName.Home} component={Home} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
