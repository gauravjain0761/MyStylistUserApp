import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useState } from "react";
import { strings } from "../../helper/string";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { images } from "../../theme/icons";

type props = {
  visible: any;
  close: any;
};

const CostModal: FC<props> = ({ visible, close }) => {
  const [isModal, setIsModal] = useState(false);
  const [cost, setCost] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.Cost}</Text>
      <View style={styles.cost_container}>
        <View style={styles.btn_conatiner}>
          <Text style={styles.btn}>{strings.Low_To_High}</Text>
          <TouchableOpacity
            style={styles.radio_btn}
            onPress={() => setCost("High")}
          >
            {cost === "High" ? (
              <View style={styles.radio_btn_icon}></View>
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={styles.btn_conatiner}>
          <Text style={styles.btn}>{strings.High_To_Low}</Text>
          <TouchableOpacity
            style={styles.radio_btn}
            onPress={() => setCost("Low")}
          >
            {cost === "Low" ? (
              <View style={styles.radio_btn_icon}></View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.btn_container}>
        <TouchableOpacity onPress={() => close(!visible)}>
          <ImageBackground
            source={images?.grey_border_button}
            style={styles.btn_style}
            resizeMode="contain"
          >
            <Text style={styles.btn_tite}>{strings.Cancel}</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => close(!visible)}>
          <ImageBackground
            source={images?.blue_button}
            style={styles.btn_style}
            resizeMode="contain"
          >
            <Text style={styles.btn_tite}>{strings.Apply}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CostModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  btn: {
    ...commonFontStyle(fontFamily.medium, 16, colors.info_grey_2),
    lineHeight: hp(24),
  },
  cost_container: {
    gap: hp(14),
    marginTop: hp(24),
    width: "100%",
  },
  btn_conatiner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  radio_btn: {
    width: wp(15),
    height: wp(15),
    borderRadius: 50,
    borderBlockColor: colors.black,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  radio_btn_icon: {
    width: wp(8),
    height: wp(8),
    borderRadius: 50,
    backgroundColor: colors.primary_light_blue,
  },
  btn_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: hp(10),
    marginTop: hp(41),
    marginHorizontal: wp(15),
  },
  btn_style: {
    height: hp(60),
    width: wp(150),
    justifyContent: "center",
    alignItems: "center",
  },
  btn_tite: {
    ...commonFontStyle(fontFamily.medium, 18, colors.black),
  },
});
