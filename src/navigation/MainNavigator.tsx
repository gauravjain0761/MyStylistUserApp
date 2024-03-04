import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { FC } from "react";
import StackNavigator from "./StackNavigator";
import DrawerNavigator from "./DrawerNavigator";

export const navigationRef = createNavigationContainerRef();

const RootContainer: FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator />
    </NavigationContainer>
  );
};
export default RootContainer;
