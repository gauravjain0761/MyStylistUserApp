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
const socket = io(api.BASE_URL);

const ChatDetails = () => {
  const { params }: any = useRoute();
  const [text, setText] = useState("");
  const { profileData } = useAppSelector((state) => state.profile);
  const [messageList, setMessageList] = useState<any>([]);
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    // Connect to the socket server
    socket.emit("join_room", params.roomId);
    socket.emit("user_online", {
      chatid: params.roomId,
      name: profileData?.user?._id,
    });
    socket.emit("fetch_messages", params.roomId);

    socket.on("update_online_users", (data) => {
      console.log("update_online_users", data);
    });

    socket.on("receive_message", (data: any) => {
      console.log("receive_message", data);
      setMessageList((list) => [...list, data]);
      socket.emit("fetch_messages", params.roomId);
      scrollToBottom();
    });

    socket.on("past_messages", (data: any) => {
      const messages = data?.messages.map((item: any) => {
        const messageData = {
          chatId: item.chat,
          senderId: item.sender._id,
          content: item.content,
          time: item.timestamp,
          image: item?.sender?.user_profile_images?.[0]?.image,
        };
        return messageData;
      });
      setMessageList(messages);
    });
    scrollToBottom();
  }, []);

  const sendMessage = (message: string) => {
    // Connect to the socket server
    const messageData = {
      chatId: params.roomId,
      senderId: profileData?.user?._id,
      content: message,
      time: new Date(),
    };
    socket.emit("send_message", messageData);
    socket.emit("fetch_messages", params.roomId);
    setText("");
    scrollToBottom();
  };

  console.log("messageList", messageList);

  const scrollToBottom = () => {
    if (flatListRef?.current) {
      setTimeout(() => {
        flatListRef?.current?.scrollToEnd({ animated: true });
      }, 600);
    }
  };

  return (
    <View style={styles.container}>
      <ChatHeader />
      <FlatList
        ref={flatListRef}
        style={styles.listStyle}
        data={messageList || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
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
          onChangeText={setText}
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
