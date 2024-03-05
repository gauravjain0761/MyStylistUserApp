import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { images } from "../../theme/icons";
import { VerifyIcon } from "../../theme/SvgIcon";

const BarberAppointmentCard = ({ name }) => {
  return (
    <View style={styles.conatiner}>
      <View style={styles.img_container}>
        <Image source={images.barber5} style={styles.img} />
      </View>
      <View style={styles.name_container}>
        <TouchableOpacity>
          <Text style={styles.barber_name}>{name}</Text>
        </TouchableOpacity>
        <VerifyIcon width={14} height={14} />
      </View>
    </View>
  );
};

export default BarberAppointmentCard;

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(20),
  },
  img_container: {},
  img: {
    width: wp(111),
    height: hp(110),
    borderRadius: wp(10),
  },
  barber_info_conatiner: {},
});
