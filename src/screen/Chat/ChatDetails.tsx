import React, { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { colors } from "../../theme/color";
import {
  ChatHeader,
  ChatInput,
  ReciverItem,
  SenderItem,
} from "../../components";
import { isIos, wp } from "../../helper/globalFunction";
import io from "socket.io-client";
import { api } from "../../helper/apiConstants";
import { useRoute } from "@react-navigation/native";
import { useAppSelector } from "../../redux/hooks";
import { getAsyncUserInfo } from "../../helper/asyncStorage";

const socket = io(api.BASE_URL);

const ChatDetails = () => {
  const { params }: any = useRoute();
  const [text, setText] = useState("");
  const { profileData } = useAppSelector((state) => state.profile);
  const [messageList, setMessageList] = useState<any>([]);
  const flatListRef = useRef<any>(null);
  const [userOnline, setUserOnline] = useState<boolean>(false);
  const [userTyping, setUserTyping] = useState<boolean>(false);
  const [roomId, setRoomId] = useState("");

  const { image } = profileData?.user?.user_profile_images?.[0] || [];

  const joinRoom = async (roomId: string) => {
    const userInfo = await getAsyncUserInfo();
    if (roomId !== "") {
      socket.emit("join_room", roomId);
      socket.emit("user_online", { chatId: roomId, name: userInfo?._id });
      getOldMessages(roomId);
    }
  };

  const getOldMessages = (roomId: string) => {
    socket.emit("fetch_messages", roomId);
  };

  useEffect(() => {
    joinRoom(params?.roomId);
    setRoomId(params?.roomId);

    socket.on("receive_message", (data: any) => {
      setMessageList((prevList: any) => [data, ...prevList]);
    });

    socket.on("update_online_users", (data) => {
      data.forEach((user: any) => {
        if (user?.name === params?.receiverId) {
          setUserOnline(true);
        }
      });
    });

    socket.on("past_messages", (data: any) => {
      const messages = data?.messages.map((item: any) => ({
        chatId: item.chat,
        senderId: item.sender._id,
        content: item.content,
        time: item.timestamp,
        image: item?.sender?.user_profile_images?.[0]?.image,
      }));
      setMessageList(messages.reverse());
    });

    socket.on("user_typing", (data) => {
      if (data?.username === params?.receiverId) {
        setUserTyping(true);
      }
    });

    socket.on("user_stopped_typing", (data) => {
      if (data?.username === params?.receiverId) {
        setUserTyping(false);
      }
    });
    return () => {
      socket.off("receive_message");
      socket.off("update_online_users");
      socket.off("past_messages");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [params?.roomId]);

  const sendMessage = async (message: string) => {
    socket.emit("typing_end", {
      chatId: roomId,
      username: profileData?.user?._id,
    });

    const messageData = {
      chatId: roomId,
      senderId: profileData?.user?._id,
      content: message,
      time: new Date(),
      user_image: image,
      device_token: params?.device_token,
      name: profileData?.user?.name,
    };

    socket.emit("send_message", messageData);
    setText("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (flatListRef?.current) {
      setTimeout(() => {
        flatListRef?.current?.scrollToOffset({ offset: 0, animated: false });
      }, 600);
    }
  };

  return (
    <View style={styles.container}>
      <ChatHeader
        name={params?.name}
        isTyping={userTyping}
        status={userOnline ? "Online" : "Offline"}
        image={params?.receiverImage || {}}
      />
      <FlatList
        ref={flatListRef}
        style={styles.listStyle}
        inverted={true}
        data={messageList || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (item?.senderId === profileData?.user?._id) {
            return <SenderItem data={item} />;
          } else {
            return <ReciverItem data={item} />;
          }
        }}
      />
      <KeyboardAvoidingView behavior={isIos ? "padding" : null}>
        <ChatInput
          value={text}
          onChangeText={(text) => {
            setText(text);
            if (text.trim().length > 0) {
              socket.emit("typing_start", {
                chatId: params.roomId,
                username: profileData?.user?._id,
              });
            } else {
              socket.emit("typing_end", {
                chatId: params.roomId,
                username: profileData?.user?._id,
              });
            }
          }}
          onPressSend={() => sendMessage(text)}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  listStyle: {
    paddingHorizontal: wp(20),
    flex: 1,
  },
});

export default ChatDetails;
