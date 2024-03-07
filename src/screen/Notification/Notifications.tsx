import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { colors } from "../../theme/color";
import { BackHeader, NotificationItem, OvalShapView } from "../../components";
import { strings } from "../../helper/string";
import { notificationFilter } from "../../helper/constunts";
import { hp, wp } from "../../helper/globalFunction";
import { MarkReadIcon, NotificationIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";

const Notifications = () => {
  const [selectIndex, setSelectIndex] = useState(0);
  return (
    <View style={styles.container}>
      <BackHeader title={strings["Notifications"]} />
      <View>
        <FlatList
          style={styles.horizontalListStyle}
          horizontal
          data={notificationFilter}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <OvalShapView
                data={item}
                index={index}
                selectIndex={selectIndex}
                onPress={setSelectIndex}
              />
            );
          }}
        />
      </View>
      <View style={styles.rowSpaceStyle}>
        <View style={styles.flexStyle}>
          <NotificationIcon />
          <Text style={styles.notificationTextStyle}>
            {strings["All Notifications"]}
          </Text>
        </View>
        <View style={styles.flexStyle}>
          <MarkReadIcon />
          <Text style={styles.markTextStyle}>
            {strings["Mark all as read"]}
          </Text>
        </View>
      </View>
      <FlatList
        style={styles.flatListStyle}
        data={[1, 2, 3, 4, 5, , 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return <NotificationItem />;
        }}
        ItemSeparatorComponent={() => <View style={styles.lineStyle} />}
        ListFooterComponent={<View style={{ marginTop: hp(30) }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  horizontalListStyle: {
    paddingLeft: wp(14),
    paddingBottom: hp(20),
    paddingVertical: hp(10),
    backgroundColor: colors.white,
  },
  rowSpaceStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(20),
    marginVertical: hp(10),
    marginTop: hp(15),
    justifyContent: "space-between",
  },
  flexStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTextStyle: {
    marginHorizontal: wp(4),
    ...commonFontStyle(fontFamily.regular, 15, colors.gery_6),
  },
  markTextStyle: {
    ...commonFontStyle(fontFamily.regular, 15, colors.blue),
    marginLeft: wp(4),
  },
  lineStyle: {
    borderTopWidth: 1,
    marginVertical: hp(20),
    borderTopColor: colors.review_caed_border,
  },
  flatListStyle: {
    marginTop: hp(15),
  },
});

export default Notifications;
