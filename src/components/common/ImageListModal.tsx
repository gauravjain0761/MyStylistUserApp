import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { colors } from "../../theme/color";
import FastImage from "react-native-fast-image";
import { hp, screen_width, wp } from "../../helper/globalFunction";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { ModalCloseIcon } from "../../theme/SvgIcon";

type props = {
  data?: any;
  baseURL?: string;
  isVisible?: boolean;
  onPressClose: () => void;
  image?: string;
};

const ImageListModal = ({
  data,
  baseURL,
  isVisible,
  onPressClose,
  image,
}: props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onSnapToItem = (index: React.SetStateAction<number>) => {
    setActiveIndex(index);
  };

  return (
    <ReactNativeModal
      style={styles.container}
      isVisible={isVisible}
      onBackdropPress={onPressClose}
      onBackButtonPress={onPressClose}
    >
      <View>
        <View style={styles.closeContainer}>
          <TouchableOpacity onPress={onPressClose}>
            <ModalCloseIcon />
          </TouchableOpacity>
        </View>
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
                  resizeMode="contain"
                  source={{
                    uri: baseURL + "/" + item.image,
                    priority: FastImage.priority.high,
                  }}
                  style={styles?.carousel_img}
                />
              </View>
            );
          }}
          onSnapToItem={onSnapToItem}
        />
        <View
          style={{
            bottom: hp(30),
            position: "absolute",
            alignSelf: "center",
          }}
        >
          <Pagination
            // @ts-ignore
            dotsLength={data?.length}
            activeDotIndex={activeIndex}
            containerStyle={styles?.pagination_container}
            dotStyle={styles?.dotStyle}
            inactiveDotStyle={styles?.inactiveDotStyle}
            inactiveDotScale={1}
            dotContainerStyle={styles?.dotContainerStyle}
          />
        </View>
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
  closeContainer: {
    position: "absolute",
    right: wp(30),
    top: hp(50),
    zIndex: 1,
  },
});

export default ImageListModal;
