import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import Modal from "react-native-modal";
import { ModalCloseIcon } from "../../theme/SvgIcon";

type props = {
  visible: boolean;
  transparent?: boolean;
  contain?: any;
  close?: any;
  containStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  isIcon?: boolean;
};

const Modals = ({
  visible = false,
  transparent = true,
  contain,
  close,
  containStyle,
  containerStyle,
  isIcon,
}: props) => {
  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      onBackdropPress={() => close(false)}
      style={{
        width: "100%",
        alignItems: "center",
        padding: 0,
        margin: 0,
        justifyContent: "flex-end",
      }}
      backdropColor="rgba(0, 0, 0, 0.8)"
    >
      <>
        {isIcon && (
          <TouchableOpacity onPress={() => close(false)}>
            <ModalCloseIcon />
          </TouchableOpacity>
        )}
        <View style={[styles.contain, containStyle]}>{contain}</View>
      </>
    </Modal>
  );
};

export default Modals;

const styles = StyleSheet.create({
  contain: {
    width: "100%",
    backgroundColor: colors.white,
    paddingHorizontal: wp(20),
    paddingVertical: hp(24),
    justifyContent: "center",
    alignItems: "flex-start",
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    marginTop: hp(10),
  },
});
