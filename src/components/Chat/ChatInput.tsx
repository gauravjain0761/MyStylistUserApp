import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { EmjoyIcon, SendButtonIcon } from "../../theme/SvgIcon";

type props = {
  value: string;
  onChangeText: (value: string) => void;
  onPressSend: () => void;
};

const ChatInput = ({ value, onChangeText, onPressSend }: props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        placeholder="Type here..."
        placeholderTextColor={colors.dashed_boredr}
        value={value}
        onChangeText={onChangeText}
      />
      {/* <TouchableOpacity style={{ marginHorizontal: wp(10) }}>
        <EmjoyIcon />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={onPressSend}>
        <SendButtonIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    margin: wp(20),
    borderColor: colors.review_caed_border,
    height: hp(65),
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(15),
  },
  inputStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
    flex: 1,
  },
});

export default ChatInput;
