import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";

const AppointmentLoader = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={90} height={100} borderRadius={10} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item width={180} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={150} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={80} height={20} />
          </SkeletonPlaceholder.Item>
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
    flexDirection: "column",
    marginVertical: hp(11),
    height: hp(150),
  },
});

export default AppointmentLoader;
