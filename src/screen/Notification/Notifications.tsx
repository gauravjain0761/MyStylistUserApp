import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { colors } from "../../theme/color";
import { BackHeader, NotificationItem, OvalShapView } from "../../components";
import { strings } from "../../helper/string";
import { notificationFilter } from "../../helper/constunts";
import { hp, wp } from "../../helper/globalFunction";
import { MarkReadIcon, NotificationIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getNotificationList } from "../../actions/notificationAction";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { useNavigation } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";

const Notifications = () => {
  const { navigate } = useNavigation();
  const [selectIndex, setSelectIndex] = useState("All");
  const { notification_list } = useAppSelector((state) => state?.notification);
  const dispatch = useAppDispatch();
  useEffect(() => {
    getNotification("All");
  }, []);
  const getNotification = async (item: any) => {
    setSelectIndex(item);
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?.userId,
        notification_type: item == "All" ? "" : item?.toLowerCase(),
      },
      onSuccess: (res: any) => {},
      onFaliure: () => {},
    };
    dispatch(getNotificationList(obj));
  };
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
                onPress={(e) => getNotification(e)}
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
        data={notification_list}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <Text style={styles.nodataTextStyle}>
              {"No Notification Found"}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          return (
            <NotificationItem
              time={item?.createdAt}
              name={item?.userId?.name}
              message={item?.message}
              image={
                item.userId?.user_profile_images?.filter(
                  (images) => images?.is_featured == 1
                )?.[0]?.image
              }
              onPress={() => {
                const type = item?.notification_type;
                if (type == "appointment") {
                  navigate(screenName.AppointmentDetails, {
                    id: item?.actionId,
                  });
                }
              }}
            />
          );
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
    flex: 1,
  },
  emptyComponent: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  nodataTextStyle: {
    ...commonFontStyle(fontFamily.regular, 15, colors.gery_1),
  },
});

export default Notifications;
