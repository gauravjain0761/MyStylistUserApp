import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  BackHeader,
  Barber_Card,
  Filter_Button,
  SelectDateModal,
  UserItemLoader,
} from "../../components";
import { strings } from "../../helper/string";
import { images } from "../../theme/icons";
import {
  convertToOutput,
  generateWeekDates,
  hp,
  infoToast,
  wp,
} from "../../helper/globalFunction";
import { barbers, stylists_filter } from "../../helper/constunts";
import { colors } from "../../theme/color";
import { fontFamily, commonFontStyle } from "../../theme/fonts";
import { useNavigation, useRoute } from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import FastImage from "react-native-fast-image";
import { getAllExpertBySubService } from "../../actions";
import moment from "moment";
import { getExpertAvailability } from "../../actions/commonActions";
import { getAsyncUserInfo } from "../../helper/asyncStorage";

const Service = () => {
  const { navigate } = useNavigation();
  const { params }: any = useRoute();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { expertUserList } = useAppSelector((state) => state.home);
  const [filterList, setFilterList] = useState(stylists_filter);
  const [filterObj, setFilterObj] = useState({});
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDateIndex, setSelectedDate] = useState(null);
  const [selectedTimeIndex, setSelectedTime] = useState(null);
  const [date, setDate] = useState("");
  const [bookTime, setBookTime] = useState({});
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    setFilterObj(params?.filterData);
    async function getDatesList() {
      let userInfo = await getAsyncUserInfo();
      let data = generateWeekDates();

      let obj = {
        data: {
          startDate: moment(data?.[0]?.date).format("YYYY-MM-DD"),
          endDate: moment(data?.[data?.length - 1]?.date).format("YYYY-MM-DD"),
          timeSlotDuration: 60,
          expertId: userInfo?.userId,
        },
        onSuccess: (response: any) => {
          setDates(convertToOutput(response));
        },
        onFailure: () => {},
      };
      dispatch(getExpertAvailability(obj));
    }
    getDatesList();
  }, []);

  const onPressDateItem = (index: any) => {
    setSelectedDate(index);
    setDate(moment(dates[index]?.title));
    setTimes(dates[index]?.value);
    setSelectedTime(null);
  };

  const onPressTimeItem = (index: any) => {
    setSelectedTime(index);
    let bookDates = times[index];
    setBookTime(bookDates);
  };

  const onPressItem = (item: any) => {
    //@ts-ignore
    navigate(screenName.YourStylist, { id: item._id });
  };

  const onPressFilterItem = (index: number) => {
    if (index === 0) {
      setIsModal(true);
    } else if (index == 3) {
      onPressRating();
    } else if (index == 4) {
      onPressBestService();
    }
    updateFilter(index);
  };

  const onCloseItem = (index: number) => {
    if (index === 0) {
      clearDates();
    } else if (index == 3) {
      clearRating();
    } else if (index == 4) {
      clearBestService();
    }
    clearFilter(index);
  };

  const updateFilter = (index: number) => {
    let data = [...filterList];
    data[index].isSelected = true;
    setFilterList([...data]);
  };

  const clearFilter = (index: number) => {
    let data = [...filterList];
    data[index].isSelected = false;
    setFilterList([...data]);
  };

  const onPressRating = () => {
    setIsLoading(true);
    let data = {
      ...filterObj,
      rating: 5,
    };
    let obj = {
      data: data,
      onSuccess: () => {
        setIsLoading(false);
        setFilterObj(data);
      },
      onFailure: (err: any) => {
        infoToast(err.data?.message);
        setIsLoading(false);
      },
    };
    dispatch(getAllExpertBySubService(obj));
  };

  const onPressBestService = () => {
    setIsLoading(true);
    let data = {
      ...filterObj,
      best_service: "Yes",
    };
    let obj = {
      data: data,
      onSuccess: () => {
        setIsLoading(false);
        setFilterObj(data);
      },
      onFailure: (err: any) => {
        infoToast(err.data?.message);
        setIsLoading(false);
      },
    };
    dispatch(getAllExpertBySubService(obj));
  };

  const onPressApplyDate = () => {
    setIsLoading(true);
    let data = {
      ...filterObj,
      dateTime: {
        timeSlot_id: bookTime?._id,
        availableDate: date,
      },
    };
    console.log("data:::", data);

    let obj = {
      data: data,
      onSuccess: () => {
        setIsLoading(false);
        setFilterObj(data);
      },
      onFailure: (err: any) => {
        infoToast(err.data?.message);
        setIsLoading(false);
      },
    };
    dispatch(getAllExpertBySubService(obj));
  };

  const clearDates = () => {
    setIsLoading(true);
    let data = {
      ...filterObj,
      dateTime: null,
    };
    let obj = {
      data: data,
      onSuccess: () => {
        setIsLoading(false);
        setFilterObj(data);
      },
      onFailure: (err: any) => {
        infoToast(err.data?.message);
        setIsLoading(false);
      },
    };
    dispatch(getAllExpertBySubService(obj));
  };

  const clearRating = () => {
    setIsLoading(true);
    let data = {
      ...filterObj,
      rating: null,
    };
    let obj = {
      data: data,
      onSuccess: () => {
        setIsLoading(false);
        setFilterObj(data);
      },
      onFailure: (err: any) => {
        infoToast(err.data?.message);
        setIsLoading(false);
      },
    };
    dispatch(getAllExpertBySubService(obj));
  };

  const clearBestService = () => {
    setIsLoading(true);
    let data = {
      ...filterObj,
      best_service: null,
    };
    let obj = {
      data: data,
      onSuccess: () => {
        setIsLoading(false);
        setFilterObj(data);
      },
      onFailure: (err: any) => {
        infoToast(err.data?.message);
        setIsLoading(false);
      },
    };
    dispatch(getAllExpertBySubService(obj));
  };

  return (
    <View style={styles.container}>
      <BackHeader
        isSearch
        title={params.item?.sub_service_name}
        onPressScreenSearch={() => navigate(screenName.SearchStylistName)}
      />
      <ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        <FastImage
          source={{
            uri: params?.item?.imageUrl,
            priority: FastImage.priority.high,
          }}
          style={styles.banner}
        />

        <View style={styles?.service_filter_conatiner}>
          <FlatList
            data={filterList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }: any) => {
              return (
                <Filter_Button
                  isSeleted={item.isSelected}
                  onPressClose={() => onCloseItem(index)}
                  isCloseIcon={item.isSelected}
                  onPress={() => onPressFilterItem(index)}
                  title={item?.title}
                  containerStyle={
                    filterList.length - 1 == index
                      ? { marginRight: wp(10) }
                      : null
                  }
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

        <ScrollView style={styles.card_container}>
          {isLoading ? (
            <View style={styles?.barber_card_container}>
              <FlatList
                data={[1, 2, 3, 4]}
                renderItem={({ item, index }) => {
                  return <UserItemLoader key={index} />;
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          ) : (
            <FlatList
              data={expertUserList?.users}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }: any) => {
                return (
                  <Barber_Card
                    featured_image_url={expertUserList?.featured_image_url}
                    name={item.name}
                    type="with Service"
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
                  />
                );
              }}
              ItemSeparatorComponent={() => (
                <View style={styles.card_separator}></View>
              )}
            />
          )}
        </ScrollView>

        <SelectDateModal
          visible={isModal}
          close={setIsModal}
          dates={dates}
          onPressDateItem={onPressDateItem}
          onPressTimeItem={onPressTimeItem}
          setIsModal={setIsModal}
          times={times}
          selectedDateIndex={selectedDateIndex}
          selectedTimeIndex={selectedTimeIndex}
          onPressApply={onPressApplyDate}
        />
      </ScrollView>
    </View>
  );
};

export default Service;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  banner: {
    width: "100%",
    height: hp(216),
  },
  service_filter_conatiner: {
    paddingLeft: wp(20),
    paddingVertical: hp(15),
    backgroundColor: colors.background_grey,
  },
  filter_item_separator: {
    width: wp(7),
  },
  title_border: {
    width: "100%",
    borderBottomWidth: hp(1),
    borderColor: colors?.stylists_border_color,
    marginHorizontal: wp(10),
    alignSelf: "center",
    backgroundColor: "yellow",
  },
  stylists_title_container: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    justifyContent: "center",
    marginBottom: hp(20),
    marginHorizontal: wp(20),
    overflow: "hidden",
  },
  your_stylists_title: {
    ...commonFontStyle(fontFamily.regular, 17, colors?.stylists_title_gray),
    paddingHorizontal: wp(16),
  },
  card_separator: {
    height: hp(28),
  },
  card_container: {
    marginHorizontal: wp(20),
    marginTop: hp(10),
  },
  barber_card_container: {
    marginHorizontal: wp(20),
    marginTop: hp(20),
    flex: 1,
  },
});
