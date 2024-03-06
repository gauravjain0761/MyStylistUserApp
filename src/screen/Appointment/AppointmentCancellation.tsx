import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { BackHeader } from "../../components";
import { strings } from "../../helper/string";
import AppointmentCancelCard from "../../components/common/AppointmentCancelCard";
import { images } from "../../theme/icons";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";

const AppointmentCancellation = () => {
  const [select, SetSelect] = useState(0);
  const reason = [
    {
      id: 1,
      title: "Order by mistake",
    },
    {
      id: 2,
      title: "Order by mistake",
    },
    {
      id: 3,
      title: "Order by mistake",
    },
    {
      id: 4,
      title: "Order by mistake",
    },
    {
      id: 5,
      title: "Order by mistake",
    },
    {
      id: 6,
      title: "Order by mistake",
    },
  ];

  const onPressConfirm = () => {};

  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings.Appointment_Cancellation} />
      <View style={styles.card}>
        <AppointmentCancelCard
          name={strings.Majid_Khan}
          image={images.barber5}
          date="26 May, 2024"
          time="08:30PM"
        />
      </View>

      <View style={styles.reason_conatiner}>
        <Text style={styles.title}>
          {strings["What is the reason of cancellation?"]}
        </Text>
        <FlatList
          data={reason}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => SetSelect(item.id)}
                style={styles.btn_conatiner}
              >
                <View style={styles.radio_btn}>
                  {select == item.id && (
                    <View style={styles.radio_btn_icon}></View>
                  )}
                </View>
                <Text style={styles.reason_title}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => (
            <View style={styles.item_separator}></View>
          )}
        />
      </View>
      <View style={styles.bottomStyle}>
        <TouchableOpacity onPress={onPressConfirm}>
          <ImageBackground
            resizeMode="contain"
            style={styles.confirmImgStyle}
            source={images.book_button}
          >
            <Text style={styles.confirmTextStyle}>
              {strings["Confirm Cancellation"]}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentCancellation;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  card: {
    marginTop: hp(25),
  },
  reason_conatiner: {
    marginHorizontal: wp(20),
    marginTop: hp(28),
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginBottom: hp(12),
  },
  radio_btn: {
    width: wp(12),
    height: wp(12),
    borderRadius: 50,
    borderBlockColor: colors.black,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  radio_btn_icon: {
    width: wp(6),
    height: wp(6),
    borderRadius: 50,
    backgroundColor: colors.primary_light_blue,
  },
  btn_conatiner: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(9),
    alignSelf: "flex-start",
  },
  reason_title: {
    ...commonFontStyle(fontFamily.bold, 15, colors.black),
    lineHeight: hp(26),
  },
  item_separator: {
    height: hp(6),
  },
  bottomStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    backgroundColor: colors.white,
    padding: wp(20),
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: hp(25),
    justifyContent: "center",
    marginTop: hp(29),
  },
  confirmImgStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  confirmTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    paddingHorizontal: wp(80),
    paddingVertical: hp(20),
  },
});
