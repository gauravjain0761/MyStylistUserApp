import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";

const AppointmentDetailsLoader = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="flex-start">
          <SkeletonPlaceholder.Item
            width={100}
            height={100}
            borderRadius={10}
          />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item width={180} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={130} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item marginTop={10} width={"100%"} height={20} />
          <SkeletonPlaceholder.Item marginTop={10} width={"80%"} height={20} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(12),
    marginHorizontal: wp(15),
    borderRadius: wp(8),
    paddingVertical: hp(17),
    marginTop: hp(25),
  },
});

export default AppointmentDetailsLoader;
