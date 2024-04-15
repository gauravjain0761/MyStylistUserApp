import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { hp } from "../../helper/globalFunction";
import { useRoute } from "@react-navigation/native";

const StylistDetails = () => {
  const { params }: any = useRoute();
  return (
    <View style={{ flex: 1 }}>
      <Animated.Image
        source={{ uri: "https://picsum.photos/200" }}
        style={{
          width: 400,
          height: 400,
          marginBottom: hp(10),
          backgroundColor: "green",
        }}
        sharedTransitionTag={`sharedTag-${params.index}`}
      />
    </View>
  );
};

export default StylistDetails;
