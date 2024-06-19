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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAsyncDevice_token,
  getAsyncUserInfo,
} from "../../helper/asyncStorage";
import { createChatRoom, messagesRead } from "../../actions";
const socket = io(api.BASE_URL);

const ChatDetails = () => {
  const { params }: any = useRoute();
  const [text, setText] = useState("");
  const { profileData } = useAppSelector((state) => state.profile);
  const [messageList, setMessageList] = useState<any>([]);
  const flatListRef = useRef<any>(null);
  const [userOnline, setUserOnline] = useState<boolean>(false);
  const [userTyping, setUserTyping] = useState<boolean>(false);
  const [roomId, setroomId] = useState("");

  const { image } = profileData?.user?.user_profile_images?.[0] || [];
  const { IMG_URL } = api;

  const dispatch = useAppDispatch();
  const createRoom = async () => {
    const userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        participants: [params?.receiverId, userInfo?._id],
      },
      onSuccess: async (res: any) => {
        joinRoom(res?.roomId);
        setroomId(res?.roomId);
      },
      onFailure: (Err: any) => {
        console.log("Err", Err);
      },
    };
    dispatch(createChatRoom(obj));
  };

  const joinRoom = async (roomId: string) => {
    const userInfo = await getAsyncUserInfo();
    if (roomId !== "") {
      socket.emit("join_room", roomId);
      socket.emit("user_online", { chatId: roomId, name: userInfo?._id });
      getoldMessages(roomId);
    }
  };

  const getoldMessages = (joinRoom: String) => {
    socket.emit("fetch_messages", joinRoom);
    scrollToBottom();
  };

  useEffect(() => {
    // Connect to the socket server
    createRoom();

    socket.on("update_online_users", (data) => {
      data.map((data: any) => {
        if (data?.name === params?.receiverId) {
          setUserOnline(true);
          return;
        }
      });
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

    socket.on("receive_message", (data: any) => {
      socket.emit("fetch_messages", roomId);
      console.log("receive_message", data);
      setMessageList((list: any) => [...list, data]);
      scrollToBottom();
    });

    socket.on("disconnect", (data) => {
      console.log("disconnect", data);
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
      messagesReads(messages[0]?.chatId);
      scrollToBottom();
    });
  }, []);

  const sendMessage = async (message: string) => {
    let token = await getAsyncDevice_token();
    socket.emit("typing_end", {
      chatId: roomId,
      username: profileData?.user?._id,
    });
    // Connect to the socket server
    const messageData = {
      chatId: roomId,
      senderId: profileData?.user?._id,
      content: message,
      time: new Date(),
      user_image: `${IMG_URL}${image}`,
      device_token: token,
    };
    socket.emit("send_message", messageData);
    socket.emit("fetch_messages", roomId);
    setText("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (flatListRef?.current) {
      setTimeout(() => {
        flatListRef?.current?.scrollToEnd({ animated: true });
      }, 600);
    }
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

  return (
    <View style={styles.container}>
      <ChatHeader
        name={params?.name}
        isTyping={userTyping}
        status={userOnline ? "Online" : "Offline"}
        image={params?.receiverImage}
      />
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
