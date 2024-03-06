import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
import DrawerHeader from "../../components/common/DrawerHeader";
import { strings } from "../../helper/string";
import { PastServices, barbers } from "../../helper/constunts";
import BarberAppointmentCard from "../../components/common/BarberAppointmentCard";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { fontFamily, commonFontStyle } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { BackHeader } from "../../components";

const Appointments = ({ navigation }) => {
  const { navigate } = useNavigation();
  const onPresstoNaviate = () => {
    navigate(screenName.appointmentDetails);
  };

  return (
    <View style={styles.container}>
      <BackHeader
        isMenu
        title={strings.Your_Appointments}
        onPressMenu={() => navigation.openDrawer()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.appointment_card}>
          <BarberAppointmentCard
            name={strings.Majid_Khan}
            date={strings["26 May 2024"]}
            time={strings["08:30 PM"]}
            location={strings.Sector_Mohali}
            service={strings.haircut_Classic_shaving}
            type="Total Price"
            price="500.00"
            image={images.barber}
            onPress={() => onPresstoNaviate()}
          />
        </View>

        <View style={styles?.stylists_title_container}>
          <View style={styles?.title_border}></View>
          <Text style={styles?.your_stylists_title}>
            {strings?.Past_Services}
          </Text>
          <View style={styles?.title_border}></View>
        </View>

        <View>
          <FlatList
            data={PastServices}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.cards}>
                  <BarberAppointmentCard
                    name={item.name}
                    date={"28 May 2024,"}
                    time={"08:30"}
                    location={item.address}
                    service={strings.haircut_Classic_shaving}
                    type={item.type}
                    isCompleted
                    price={item.price}
                    image={item.image}
                  />
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appointment_card: {
    marginTop: hp(25),
  },
  title_border: {
    width: "100%",
    borderBottomWidth: hp(1),
    borderColor: colors?.stylists_border_color,
    marginHorizontal: wp(10),
    alignSelf: "center",
    backgroundColor: "yellow",
  },
  stylists_title_container: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    justifyContent: "center",
    marginBottom: hp(20),
    marginHorizontal: wp(20),
    overflow: "hidden",
    marginTop: hp(31),
  },
  your_stylists_title: {
    ...commonFontStyle(fontFamily.regular, 17, colors?.stylists_title_gray),
    paddingHorizontal: wp(16),
  },
  cards: {
    marginVertical: hp(11),
  },
});

export default Appointments;
