import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { hp, wp } from "../../helper/globalFunction";

const CarouselLoader = ({
  height = hp(467),
  marginTop,
}: {
  height?: number;
  marginTop?: number;
}) => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
        <SkeletonPlaceholder.Item
          marginLeft={wp(20)}
          width={"88%"}
          height={height || hp(467)}
          marginRight={wp(20)}
          marginTop={marginTop}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default CarouselLoader;
