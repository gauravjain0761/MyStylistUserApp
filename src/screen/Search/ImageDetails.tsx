import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import {
  BackHeader,
  Barber_Card,
  CostModal,
  Filter_Button,
  Modals,
  ReviewModal,
  SelectDateModal,
  UserItemLoader,
} from "../../components";
import { strings } from "../../helper/string";
import { images } from "../../theme/icons";
import {
  generateTimes,
  generateWeekDates,
  hp,
  screen_width,
  wp,
} from "../../helper/globalFunction";
import { barbers, stylists_filter } from "../../helper/constunts";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { colors } from "../../theme/color";
import { screenName } from "../../helper/routeNames";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAllExpertBySubService } from "../../actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const ImageDetails = () => {
  const { params }: any = useRoute();
  const { navigate } = useNavigation();
  const [isModal, setIsModal] = useState(false);
  const [costmodal, setCostmodal] = useState(false);
  const [dates, setDates] = useState(generateWeekDates());
  const [times, setTimes] = useState(generateTimes());
  const [reviewModal, setReviewModal] = useState(false);
  const dispatch = useAppDispatch();
  const { expertUserList } = useAppSelector((state) => state.home);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let obj = {
      data: {
        sub_service_id: params?.item?._id,
        limit: 20,
        page: 1,
      },
      onSuccess: () => {
        setLoading(false);
        // @ts-ignore
      },
      onFailure: (err: any) => {
        setLoading(false);
      },
    };
    dispatch(getAllExpertBySubService(obj));
  };

  const onPressDateItem = (item: any) => {
    let data = [...dates];

    dates.map((eItem, index) => {
      if (eItem.id === item.id) {
        eItem.isSelected = true;
      } else {
        eItem.isSelected = false;
      }
    });
    setDates(data);
  };

  const onPressTimeItem = (item: any) => {
    let data = [...times];
    times.map((eItem, index) => {
      if (eItem.id === item.id) {
        eItem.isSelected = true;
      } else {
        eItem.isSelected = false;
      }
    });
    setTimes(data);
  };

  const ModalHendler = (item: any) => {
    if (item == 1) {
      setIsModal(!isModal);
    } else if (item == 2) {
    } else if (item == 3) {
      setCostmodal(!costmodal);
    }
  };
  const onPressItem = (item: any) => {
    //@ts-ignore
    navigate(screenName.YourStylist, { id: item._id });
  };

  return (
    <View style={styles.conatiner}>
      <BackHeader title={params?.item?.sub_service_name} />
      <ScrollView stickyHeaderIndices={[1]}>
        <View />
        <View style={styles?.service_filter_conatiner}>
          <FlatList
            data={stylists_filter}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }: any) => {
              return (
                <Filter_Button
                  onPress={() => {
                    ModalHendler(item.id);
                  }}
                  title={item?.title}
                  type={item?.isIcon == true ? "icon" : "simple"}
                />
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={styles?.filter_item_separator}></View>
            )}
          />
        </View>
        <View style={styles?.stylists_title_container}>
          <View style={styles?.title_border}></View>
          <Text style={styles?.your_stylists_title}>
            {strings?.YOUR_Stylists}
          </Text>
          <View style={styles?.title_border}></View>
        </View>
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6]}
            renderItem={({ item, index }) => {
              return <UserItemLoader />;
            }}
          />
        ) : (
          <>
            {expertUserList?.users?.length > 0 ? (
              <View style={styles?.barber_card_container}>
                <FlatList
                  scrollEnabled={false}
                  data={expertUserList?.users || []}
                  renderItem={({ item, index }) => {
                    return (
                      <Barber_Card
                        featured_image_url={expertUserList?.featured_image_url}
                        name={item.name}
                        type="Without Service"
                        images={item?.user_profile_images}
                        rating={item.averageRating}
                        jobs={item?.jobDone}
                        location={
                          item?.city?.[0]?.city_name +
                          ", " +
                          item?.district?.[0]?.district_name +
                          ", " +
                          item?.state?.[0]?.state_name
                        }
                        offers={item?.offers}
                        service={params.item?.sub_service_name}
                        carouselitemHeight={hp(157)}
                        carouselitemWidth={wp(132)}
                        onPress={() => onPressItem(item)}
                        data={item}
                        isOtherWayLocation
                      />
                    );
                  }}
                  ItemSeparatorComponent={() => (
                    <View style={styles.card_separator}></View>
                  )}
                />
              </View>
            ) : (
              <View style={styles.centerContainer}>
                <Text style={styles.nodataTextStyle}>{"No Data Found"}</Text>
              </View>
            )}
          </>
        )}

        <Modals
          visible={costmodal}
          close={setCostmodal}
          contain={<CostModal visible={costmodal} close={setCostmodal} />}
        />
        <SelectDateModal
          visible={isModal}
          close={setIsModal}
          dates={dates}
          onPressDateItem={onPressDateItem}
          onPressTimeItem={onPressTimeItem}
          setIsModal={setIsModal}
          times={times}
        />
        <Modals
          close={setReviewModal}
          visible={reviewModal}
          containStyle={{ maxHeight: "80%" }}
          contain={<ReviewModal />}
          isIcon
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  bannerImgStyle: {
    width: "100%",
    height: hp(254),
  },
  filter_item_separator: {
    width: wp(7),
  },
  service_filter_conatiner: {
    paddingLeft: wp(20),
    paddingBottom: hp(10),
    paddingTop: hp(10),
    backgroundColor: colors.background_grey,
  },
  stylists_title_container: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    justifyContent: "center",
    marginBottom: hp(30),
    marginHorizontal: wp(20),
    overflow: "hidden",
    marginTop: hp(20),
  },
  your_stylists_title: {
    ...commonFontStyle(fontFamily.medium, 17, colors.stylists_title_gray),
    paddingHorizontal: wp(16),
  },
  title_border: {
    width: "100%",
    borderBottomWidth: hp(1),
    borderColor: colors?.stylists_border_color,
    marginHorizontal: wp(10),
    alignSelf: "center",
  },
  barber_card_container: {
    marginHorizontal: wp(20),
  },
  card_separator: {
    height: hp(24),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nodataTextStyle: {
    ...commonFontStyle(fontFamily.medium, 14, colors.black),
    marginTop: hp(20),
  },
});

export default ImageDetails;
