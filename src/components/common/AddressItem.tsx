import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { MenuHorizontalIcon, TabHome } from "../../theme/SvgIcon";
import { Menu, MenuDivider, MenuItem } from "react-native-material-menu";
import { strings } from "../../helper/string";

type props = {
  onPressEdit: () => void;
  onPressDelete: () => void;
  data: any;
};

const AddressItem = ({ onPressEdit, onPressDelete, data }: props) => {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  return (
    <View style={styles.itemContainer}>
      <View style={styles.rowItemStyle}>
        <TabHome />
        <Text style={styles.boldTextStyle}>{data?.address?.addressType}</Text>
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity onPress={showMenu}>
              <MenuHorizontalIcon />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
        >
          <MenuItem
            textStyle={styles.menuTextStyle}
            onPress={() => {
              hideMenu();
              setTimeout(() => {
                onPressEdit();
              }, 1000);
            }}
          >
            {strings["Edit"]}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            textStyle={{ ...styles.menuTextStyle, color: colors.red }}
            onPress={() => {
              hideMenu();
              setTimeout(() => {
                onPressDelete();
              }, 1000);
            }}
          >
            {strings["Delete"]}
          </MenuItem>
        </Menu>
      </View>
      <Text numberOfLines={3} style={styles.addressTextStyle}>
        {/* {
          "Flat No. 14, Ansal Palm Grove, Sector-115 landran-kharar Road, Mohali"
        } */}
        {data?.address?.houseNumber} {data?.address?.sector}{" "}
        {data?.address?.pinCode} {data?.address?.landmark}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 8,
    marginBottom: hp(20),
    marginHorizontal: wp(20),
    backgroundColor: colors.white,
    padding: wp(14),
  },
  rowItemStyle: {
    flexDirection: "row",
  },
  boldTextStyle: {
    ...commonFontStyle(fontFamily.medium, 18, "#313131"),
    marginHorizontal: wp(10),
    flex: 1,
  },
  addressTextStyle: {
    ...commonFontStyle(fontFamily.regular, 15, "#7C7C7C"),
    marginLeft: wp(35),
    marginTop: hp(8),
  },
  menuTextStyle: {
    ...commonFontStyle(fontFamily.regular, 16, colors.black),
  },
});

export default AddressItem;
