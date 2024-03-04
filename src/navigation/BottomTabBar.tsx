import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screen/Home/Home";
import Offers from "../screen/Offer/Offers";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Offers" component={Offers} />
    </Tab.Navigator>
  );
}

export default MyTabs;
