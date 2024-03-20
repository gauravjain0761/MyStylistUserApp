import React from "react";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenName } from "../helper/routeNames";
import { hp, isIos, wp } from "../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../theme/fonts";
import { colors } from "../theme/color";
import {
  AppointmentTabIcon,
  ChatTabIcon,
  PackagesTabIcon,
  TabHome,
  TabOffer,
} from "../theme/SvgIcon";

import Home from "../screen/Home/Home";
import Offers from "../screen/Offer/Offers";
import Appointments from "../screen/Appointment/Appointments";
import Packages from "../screen/Package/Packages";
import Chats from "../screen/Chat/Chats";

const Tab = createBottomTabNavigator();

const getIcons = (key: number, isFocused: boolean) => {
  switch (key) {
    case 0:
      return <TabHome color={isFocused ? colors.theme_1 : colors.gery_6} />;
    case 1:
      return <TabOffer color={isFocused ? colors.theme_1 : colors.gery_6} />;
    case 2:
      return (
        <AppointmentTabIcon
          color={isFocused ? colors.theme_1 : colors.gery_6}
        />
      );
    case 3:
      return (
        <PackagesTabIcon color={isFocused ? colors.theme_1 : colors.gery_6} />
      );
    case 4:
      return <ChatTabIcon color={isFocused ? colors.theme_1 : colors.gery_6} />;
    default:
      break;
  }
};

const TabBarItem = ({ state, navigation }: BottomTabBarProps) => {
  return (
    <SafeAreaView style={styles.itemContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[styles.itemViewContainer]}
          >
            {getIcons(index, isFocused)}
            <Text
              numberOfLines={1}
              style={{
                ...styles.itemLabelTextStyle,
                color: isFocused ? colors.theme_1 : colors.gery_6,
              }}
            >
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </SafeAreaView>
  );
};

function BottomTabBar() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBarItem {...props} />}
      initialRouteName={screenName.tab_bar_name.Home}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name={screenName.tab_bar_name.Home} component={Home} />
      <Tab.Screen name={screenName.tab_bar_name.Offer} component={Offers} />
      <Tab.Screen
        name={screenName.tab_bar_name.Appointment}
        component={Appointments}
      />
      <Tab.Screen name={screenName.tab_bar_name.Package} component={Packages} />
      <Tab.Screen name={screenName.tab_bar_name.Chat} component={Chats} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  itemIconStyle: {
    height: hp(27),
    width: wp(27),
  },
  itemLabelTextStyle: {
    ...commonFontStyle(fontFamily.regular, 13, colors.gery_6),
    marginTop: hp(5),
  },
  itemContainer: {
    height: hp(65),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: wp(25),
  },
  itemViewContainer: {
    height: hp(65),
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: isIos ? hp(10) : -hp(10),
  },
  itemFocusContainer: {
    backgroundColor: colors.theme_1,
    paddingHorizontal: wp(10),
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});

export default BottomTabBar;
