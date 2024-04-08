import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { hp } from "../../helper/globalFunction";

const UserItemLoader = () => {
  return (
    <View style={{ marginTop: hp(13) }}>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item
            width={120}
            height={120}
            borderRadius={10}
          />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item width={180} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={120} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={100} height={20} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default UserItemLoader;
