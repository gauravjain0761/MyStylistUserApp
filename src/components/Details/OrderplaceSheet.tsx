import React, { FC, Dispatch, SetStateAction, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
  Platform,
  Image as RnImage,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
} from "react-native";
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  cancelAnimation,
  withRepeat,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors as Color } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";

interface Props {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  title?: string;
  discription?: string;
  onPressCancel?: () => void;
  onSuccess?: () => void;
}

const SPRING_CONFIG = {
  mass: 1.5,
  damping: 15,
  stiffness: 60,
  overshootClamping: false,
  restSpeedThreshold: 0.01,
  restDisplacementThreshold: 0.01,
};

const SHEET_HEIGHT = hp(75);
const hiddenPosition = hp(50);
const OrderplaceSheet: FC<Props> = ({
  visibility,
  setVisibility,
  title,
  discription,
  onPressCancel,
  onSuccess = () => {},
}) => {
  const insets = useSafeAreaInsets();
  const snapPoints = [0, hiddenPosition];
  const translateY = useSharedValue(SHEET_HEIGHT);
  const opacity = useSharedValue(0);
  const width = useSharedValue(0);

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const increaseWidth = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  useEffect(() => {
    if (visibility) {
      progressbar();
    }
  }, [visibility]);

  const progressbar = () => {
    width.value = withTiming(wp(220), { duration: 10000 }, (isFinished) => {
      if (isFinished) {
        runOnJS(finish)();
      }
    });
  };

  const finish = () => {
    setVisibility(false);
    width.value = 0;
    onSuccess();
  };

  const toggleBottomSheet = (param: string) => {
    const translateTo = param === "show" ? 0 : SHEET_HEIGHT;
    const opacityTo = param === "show" ? 0.6 : 0;
    opacity.value = withTiming(opacityTo, { duration: 700 });
    translateY.value = withTiming(translateTo, { duration: 700 }, () => {
      if (param === "hide") {
        runOnJS(setVisibility)(false);
      }
    });
  };

  const pan = Gesture.Pan()
    .onChange((event: any) => {
      let newY = event.changeY;
      if (newY < 0) {
        newY = 0;
      } else if (newY > hiddenPosition) {
        newY = hiddenPosition;
      }
      translateY.value += newY;
    })
    .onFinalize((event: any) => {
      const targetPoint = snapPoints.reduce((acc, point) => {
        return Math.abs(translateY.value - point) <
          Math.abs(translateY.value - acc)
          ? point
          : acc;
      }, snapPoints[0]);
      translateY.value = withSpring(targetPoint, SPRING_CONFIG);
      if (targetPoint === hiddenPosition) {
        runOnJS(toggleBottomSheet)("hide");
      }
    });

  useEffect(() => {
    toggleBottomSheet("show");
  }, []);

  return (
    <Modal
      visible={visibility}
      transparent={true}
      style={StyleSheet.absoluteFill}
    >
      <View
        style={{
          flex: 1,
          zIndex: 100,
          width: "100%",
          height: "100%",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, width: "100%", height: "100%" }}
          behavior={Platform.OS == "android" ? "height" : "padding"}
        >
          <Animated.View style={[styles.overlay, overlayStyle]} />
          <View style={styles.container}>
            <Animated.View style={[styles.bottomSheet, bottomSheetStyle]}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.discription}>{discription}</Text>
              <View style={styles.progresscontainer}>
                <Animated.View style={styles.barbg}>
                  <Animated.View
                    style={[styles.innerbar, increaseWidth]}
                  ></Animated.View>
                </Animated.View>
                <TouchableOpacity
                  onPress={() => (
                    onPressCancel(), cancelAnimation(width), (width.value = 0)
                  )}
                  style={styles.button}
                >
                  <Text style={styles.buttontitle}>{"Cancel"}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    height: "100%",
    width: "100%",
    backgroundColor: Color?.black,
  },
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    paddingTop: hp(10),
    paddingHorizontal: wp(30),
    width: "100%",
    backgroundColor: "white",
  },
  title: {
    ...commonFontStyle(fontFamily.semi_bold, 23, Color?.black),
    alignSelf: "center",
    marginTop: hp(22),
    lineHeight: hp(26),
  },
  discription: {
    ...commonFontStyle(fontFamily.medium, 14, Color?.gery_1),
    alignSelf: "center",
    marginTop: hp(17),
    lineHeight: hp(24),
    textAlign: "center",
  },
  progresscontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(30),
    justifyContent: "space-between",
    gap: wp(20),
    marginBottom: hp(50),
  },
  barbg: {
    width: "70%",
    height: hp(12),
    backgroundColor: Color?.grey_E7,
    borderRadius: wp(100),
    overflow: "hidden",
  },
  buttontitle: {
    ...commonFontStyle(fontFamily.medium, 13, Color?.black),
    paddingHorizontal: wp(25),
    paddingVertical: hp(10),
  },
  button: {
    backgroundColor: Color?.primary_light_blue,
    borderRadius: wp(5),
  },
  innerbar: {
    width: "0%",
    backgroundColor: Color?.primary_light_blue,
    height: hp(12),
    borderRadius: wp(100),
  },
});

export default OrderplaceSheet;
