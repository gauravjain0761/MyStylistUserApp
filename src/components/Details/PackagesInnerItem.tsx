import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { hp, wp } from "../../helper/globalFunction";
import { colors } from "../../theme/color";
import { PackagesIcon, PackagesText, TrashIcon } from "../../theme/SvgIcon";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCart, removeToCart } from "../../actions";
import { getAsyncUserInfo } from "../../helper/asyncStorage";
import { ADD_TO_CART } from "../../actions/dispatchTypes";

type Props = {
  data: any;
};

const PackagesInnerItem = ({ data }: Props) => {
  const { addtocart } = useAppSelector((state) => state.cart);
  const [count, setCount] = useState(0);

  const dispatch = useAppDispatch();

  const onPressDelete = useCallback(async () => {
    let itemId = "";
    addtocart?.items?.map((item) => {
      data.service_name.map((items) => {
        if (item.serviceId == items?._id) {
          itemId = item._id;
        }
      });
    });
    let userInfo = await getAsyncUserInfo();
    let passData = {
      userId: userInfo?._id,
      itemId: itemId,
    };
    let obj = {
      data: passData,
      onSuccess: (response: any) => {
        setCount(count - 1);
        console.log("ressponce", response);
      },
      onFailure: (Err: any) => {
        console.log("Errrr", Err);
      },
    };

    dispatch(removeToCart(obj));
  }, [count]);

  const onPressAdd = useCallback(async () => {
    let userInfo = await getAsyncUserInfo();
    let items: any = [];
    data?.service_name.map((item: any) => {
      let obj: any = {
        serviceId: item?._id,
        serviceName: item?.service_name,
        serviceType: "Package",
        price: data?.rate,
        quantity: 1,
      };
      items.push(obj);
    });
    let passData = {
      userId: userInfo._id,
      expertId: data?.expert_id,
      items: items,
    };
    let obj = {
      data: passData,
      onSuccess: (response: any) => {
        dispatch({ type: ADD_TO_CART, payload: response.data });
        setCount(count + 1);
      },
      onFailure: (Err: any) => {
        console.log("Errrr", Err);
      },
    };
    dispatch(addToCart(obj));
  }, [count]);

  return (
    <View style={styles.container}>
      <View style={styles.cloumStyle}>
        <View style={styles.rowStyle}>
          <PackagesIcon />
          <View style={{ width: wp(3) }} />
          <PackagesText />
        </View>
        <Text style={styles.labelTextStyle}>{data?.package_name}</Text>
        <Text style={styles.priceTextStyle}>
          {"₹ "}
          {data?.rate}
        </Text>
        <View style={{ height: hp(8) }} />
        {data?.service_name?.map((item, index) => {
          return (
            <View style={styles.rowStyle}>
              <View style={styles.dotStyle} />
              <Text style={styles.boldTextStyle}>
                {item?.service_name}:{" "}
                <Text style={styles.greyTextStyle}>
                  {item?.sub_services
                    ?.map(
                      (sub_service_item: any, index: number) =>
                        sub_service_item?.sub_service_name
                    )
                    .join(", ")}
                </Text>
              </Text>
            </View>
          );
        })}
      </View>
      {count === 0 ? (
        <TouchableOpacity onPress={onPressAdd}>
          <ImageBackground
            resizeMode="contain"
            style={styles.btnStyle}
            source={images.green_button}
          >
            <Text style={styles.addTextStyle}>{strings["Add"]}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ) : (
        <View>
          <ImageBackground
            resizeMode="contain"
            style={styles.btnStyle}
            source={images.green_button}
          >
            <TouchableOpacity onPress={onPressDelete}>
              <TrashIcon />
            </TouchableOpacity>
            <Text style={styles.countTextStyle}>{count}</Text>
            <TouchableOpacity onPress={onPressAdd}>
              <Text style={styles.plusTexStyke}>+</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: hp(15),
    paddingHorizontal: wp(20),
    borderBottomColor: colors.active_dot,
    flexDirection: "row",
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(5),
  },
  cloumStyle: {
    flex: 1,
  },
  labelTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  priceTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.black),
    marginVertical: hp(5),
  },
  boldTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.black),
  },
  greyTextStyle: {
    ...commonFontStyle(fontFamily.regular, 12, colors.gery_5),
  },
  dotStyle: {
    height: wp(4),
    width: wp(4),
    borderRadius: wp(4 / 2),
    backgroundColor: colors.black,
    marginRight: wp(5),
  },
  btnStyle: {
    height: hp(30),
    width: wp(80),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(10),
  },
  addTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.green_2),
  },
  countTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 16, colors.green_2),
    marginHorizontal: wp(14),
  },
  plusTexStyke: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors.green_2),
  },
});

export default PackagesInnerItem;
