import React from "react";
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { colors } from "../../theme/color";
import {
  ChatHeader,
  ChatInput,
  ReciverItem,
  SenderItem,
} from "../../components";
import { wp } from "../../helper/globalFunction";

const ChatDetails = () => {
  return (
    <View style={styles.container}>
      <ChatHeader />
      <FlatList
        style={styles.listStyle}
        data={[1, 2]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return <ReciverItem />;
          } else {
            return <SenderItem />;
          }
        }}
      />
      <ChatInput />
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
