import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { screenName } from "../helper/routeNames";
import CustomDrawer from "../components/common/CustomDrawer";
import MyTabs from "../navigation/BottomTabBar";

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, drawerType: "front" }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name={screenName.BttomTabBar} component={MyTabs} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
