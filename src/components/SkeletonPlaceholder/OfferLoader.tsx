import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { hp } from "../../helper/globalFunction";

const OfferLoader = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item flexDirection="row">
        <SkeletonPlaceholder.Item marginTop={hp(25)} marginLeft={20}>
          <SkeletonPlaceholder.Item width={150} height={20} />
          <SkeletonPlaceholder.Item marginTop={6} width={100} height={20} />
          <SkeletonPlaceholder.Item marginTop={10} width={60} height={20} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginLeft={110}
          marginTop={hp(20)}
          width={80}
          height={80}
          borderRadius={10}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default OfferLoader;
