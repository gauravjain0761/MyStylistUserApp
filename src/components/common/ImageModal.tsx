import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { colors } from "../../theme/color";
import FastImage from "react-native-fast-image";
import { hp, screen_width, wp } from "../../helper/globalFunction";
import Carousel from "react-native-snap-carousel";

type props = {
  data?: any;
  baseURL?: string;
};

const ImageModal = ({ data, baseURL }: props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onSnapToItem = (index: React.SetStateAction<number>) => {
    setActiveIndex(index);
  };

  return (
    <ReactNativeModal style={styles.container} isVisible={false}>
      <View>
        <Carousel
          layout={"default"}
          data={data}
          sliderWidth={screen_width}
          itemWidth={screen_width}
          inactiveSlideScale={2}
          renderItem={({ item }: any) => {
            return (
              <View style={styles?.carousel_img_container}>
                <FastImage
                  source={{
                    uri: baseURL + "/" + item?.image,
                    priority: FastImage.priority.high,
                  }}
                  defaultSource={item?.image}
                  style={styles?.carousel_img}
                />
              </View>
            );
          }}
          onSnapToItem={onSnapToItem}
        />
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  },
  carousel_img_container: {},
  pagination_container: {
    justifyContent: "center",
    alignSelf: "center",
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: hp(24),
  },
  dotContainerStyle: {
    margin: 0,
    marginHorizontal: wp(4),
  },
  inactiveDotStyle: {
    backgroundColor: colors?.active_dot,
  },
  dotStyle: {
    width: wp(6),
    height: wp(6),
    borderRadius: 5,
    backgroundColor: colors?.inactive_dot,
  },
  carousel_img: {
    width: "100%",
    height: "100%",
  },
});

export default ImageModal;
