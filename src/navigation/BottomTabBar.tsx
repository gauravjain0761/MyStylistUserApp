import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screen/Home/Home";
import Offers from "../screen/Offer/Offers";
import { OfferIcon, TabHome, TabOffer } from "../theme/SvgIcon";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        options={{
          tabBarIcon: () => <TabHome />,
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{ tabBarIcon: () => <TabOffer /> }}
        name="Offers"
        component={Offers}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
