import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  RefreshControl,
} from "react-native";
import { BackHeader, ChatLoader, MessageItem } from "../../components";
import { strings } from "../../helper/string";
import { hp, wp } from "../../helper/globalFunction";
import { images } from "../../theme/icons";
import { colors } from "../../theme/color";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { screenName } from "../../helper/routeNames";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createChatRoom,
  getChatParticipants,
  messagesRead,
  unReadList,
} from "../../actions";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { api } from "../../helper/apiConstants";

const Chats = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [type, setType] = useState("All");
  const { chatParticipants, unreadList } = useAppSelector(
    (state) => state.chat
  );
  const [loading, setLoading] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);
  const { profileData } = useAppSelector((state) => state?.profile);

  const isFocused = useIsFocused();
  useEffect(() => {
    setLoading(true);
    getChatsUserList();
    getUnreadList();
  }, [isFocused]);

  const getChatsUserList = async () => {
    let userInfo = await getAsyncUserInfo();

    let obj = {
      url: `${api?.chatParticipants}${userInfo?.userId}?role=expert`,
      onSuccess: () => {
        setLoading(false);
        setIsRefresh(false);
      },
      onFailure: () => {
        setLoading(false);
        setIsRefresh(false);
      },
    };
    dispatch(getChatParticipants(obj));
  };

  const getUnreadList = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        currentUserId: userInfo?.userId,
      },
      onSuccess: () => {
        setLoading(false);
        setIsRefresh(false);
      },
      onFailure: () => {
        setLoading(false);
        setIsRefresh(false);
      },
    };
    dispatch(unReadList(obj));
  };

  const onPressItem = async (item: any) => {
    const userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        participants: [item?._id, userInfo?.userId],
      },
      onSuccess: async (res: any) => {
        messagesReads(res?.roomId);
        navigation.navigate(screenName.ChatDetails, {
          roomId: res?.roomId,
          name: item?.name,
          receiverId: item?._id,
          receiverImage: item?.user_profile_images?.filter(
            (images) => images?.is_featured == 1
          )?.[0]?.image,
          device_token: item?.device_token,
        });
      },
      onFailure: (Err: any) => {
        console.log("Err", Err);
      },
    };
    dispatch(createChatRoom(obj));
  };

  const messagesReads = async (item: string) => {
    const obj = {
      data: {
        messageId: item,
      },
      onSuccess: (Res: any) => {},
      onFailure: (Err: any) => {
        console.log("Errr", Err);
      },
    };
    dispatch(messagesRead(obj));
  };

  const onPressMenu = () => {
    navigation?.openDrawer();
  };

  const onRefresh = () => {
    setIsRefresh(true);
    getChatsUserList();
  };

  const count = unreadList?.users?.filter((user) => user?.isRead == false);

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
            {count?.length > 0 && (
              <View style={styles.circleStyle}>
                <Text style={styles.countTextStyle}>{count.length}</Text>
              </View>
            )}
          </ImageBackground>
        </TouchableOpacity>
      </View>
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={({ item, index }) => {
            return <ChatLoader />;
          }}
        />
      ) : (
        <>
          {chatParticipants?.users?.length ? (
            type == "All" ? (
              <FlatList
                style={styles.flatListStyle}
                data={chatParticipants?.users || []}
                ListFooterComponent={() => (
                  <View style={{ marginTop: hp(12) }} />
                )}
                renderItem={({ item, index }) => {
                  return (
                    <MessageItem
                      index={index}
                      data={item}
                      onPressItem={() => onPressItem(item)}
                    />
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.lineStyle} />}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefresh}
                    onRefresh={onRefresh}
                  />
                }
              />
            ) : (
              <FlatList
                style={styles.flatListStyle}
                data={unreadList?.users || []}
                renderItem={({ item, index }) => {
                  return (
                    <MessageItem
                      index={index}
                      data={item}
                      onPressItem={() => onPressItem(item)}
                      unreadMessageCount={item?.unreadMessageCount}
                    />
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={(item) => (
                  <View style={styles.lineStyle} />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefresh}
                    onRefresh={onRefresh}
                  />
                }
              />
            )
          ) : (
            <View style={styles.center}>
              <Text style={styles.noDataTextStyle}>{"No Data"}</Text>
            </View>
          )}
        </>
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
  loaderContainer: {
    paddingHorizontal: wp(20),
    marginTop: hp(10),
  },
});

export default Chats;
