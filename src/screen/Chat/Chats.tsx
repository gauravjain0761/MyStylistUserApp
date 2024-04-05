import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import { BackHeader, MessageItem } from "../../components";
import { strings } from "../../helper/string";
import { hp, wp } from "../../helper/globalFunction";
import { images } from "../../theme/icons";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { screenName } from "../../helper/routeNames";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getChatParticipants } from "../../actions";

const Chats = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [type, setType] = useState("All");
  const { chatParticipants } = useAppSelector((state) => state.chat);

  useEffect(() => {
    getChatsUserList();
  }, []);

  const getChatsUserList = async () => {
    let userInfo = await getAsyncUserInfo();

    let obj = {
      data: {
        userId: userInfo._id,
      },
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getChatParticipants(obj));
  };

  const onPressItem = () => {
    navigation.navigate(screenName.ChatDetails);
  };

  const onPressMenu = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.container}>
      <BackHeader isMenu title={strings.Messages} onPressMenu={onPressMenu} />
      <View style={styles.rowStyle}>
        <TouchableOpacity
          onPress={() => setType("All")}
          style={{ marginHorizontal: wp(5) }}
        >
          <ImageBackground
            source={
              type === "All" ? images.blue_border_button : images.unselect_grey
            }
            resizeMode="stretch"
            resizeMethod="scale"
            style={styles.oval_bg}
          >
            <Text style={styles.labelTextStyle}>{strings.All}</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setType("Unread")}
          style={{ marginHorizontal: wp(5) }}
        >
          <ImageBackground
            source={
              type !== "All" ? images.blue_border_button : images.unselect_grey
            }
            resizeMode="stretch"
            resizeMethod="scale"
            style={styles.oval_bg}
          >
            <Text style={styles.labelTextStyle}>{strings.Unread}</Text>
            <View style={styles.circleStyle}>
              <Text style={styles.countTextStyle}>{"1"}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      {chatParticipants?.chatParticipants?.length ? (
        <FlatList
          style={styles.flatListStyle}
          data={chatParticipants?.chatParticipants || []}
          renderItem={({ item, index }) => {
            return (
              <MessageItem
                index={index}
                onPressItem={() => onPressItem(item)}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.lineStyle} />}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.noDataTextStyle}>{"No Data"}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(10),
    alignSelf: "center",
  },
  oval_bg: {
    width: wp(110),
    alignItems: "center",
    flexDirection: "row",
    paddingTop: hp(10),
    paddingBottom: hp(10),
    paddingHorizontal: wp(15),
    gap: wp(5),
    justifyContent: "center",
  },
  circleStyle: {
    height: hp(20),
    backgroundColor: colors.primary_light_blue,
    width: "auto",
    paddingHorizontal: wp(6),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  countTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.black_2),
  },
  labelTextStyle: {
    ...commonFontStyle(fontFamily.regular, 14, colors.black_2),
  },
  lineStyle: {
    borderTopWidth: 1,
    marginVertical: hp(20),
    borderTopColor: colors.review_caed_border,
  },
  flatListStyle: {
    marginTop: hp(15),
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 14, colors.black),
  },
});

export default Chats;
