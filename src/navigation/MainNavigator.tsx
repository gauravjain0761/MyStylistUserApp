import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { FC } from "react";
import StackNavigator from "./StackNavigator";
import React from "react";

export const navigationRef = createNavigationContainerRef();

const RootContainer: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator />
    </NavigationContainer>
  );
};
export default RootContainer;
