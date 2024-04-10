import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { hp, wp } from "../../helper/globalFunction";

const ChatLoader = () => {
  return (
    <View style={styles.loaderContainer}>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item width={80} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={180} height={20} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    paddingHorizontal: wp(20),
    marginTop: hp(10),
  },
});

export default ChatLoader;
