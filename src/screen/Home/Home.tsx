import {
  ActivityIndicator,
  FlatList,
  // FlatList,
  Image,
  ImageBackground,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { colors } from "../../theme/color";
import {
  convertToOutput,
  generateWeekDates,
  hp,
  infoToast,
  isCloseToBottom,
  screen_height,
  screen_width,
  wp,
} from "../../helper/globalFunction";
import { images } from "../../theme/icons";
import { strings } from "../../helper/string";
import { ReviewFilter, stylists_filter } from "../../helper/constunts";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import {
  AnimatedSearchBars,
  Barber_Card,
  CarouselLoader,
  Filter_Button,
  HomeHeader,
  Loader,
  LocationModal,
  Modals,
  ReviewModal,
  SelectDateModal,
  UserItemLoader,
} from "../../components";
import babelConfig from "../../../babel.config";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { screenName } from "../../helper/routeNames";
import CostModal from "../../components/common/CostModal";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import CityModal from "../../components/common/CityModal";
import {
  getAddress,
  requestLocationPermission,
} from "../../helper/locationHandler";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAllBanner,
  getAllExpertBySubService,
  getAllServicesForMaleAndFemale,
  getAllSubServicesForMobile,
  getUserItemDetails,
  getUsersByLocation,
} from "../../actions/homeAction";
import {
  CART_DETAILS,
  COORD,
  IS_LOADING,
  LOCATION,
  SELECTED_SERVICE,
  TIME_SLOT,
} from "../../actions/dispatchTypes";
import {
  getAsyncCoord,
  getAsyncIsAddressed,
  getAsyncLocation,
  getAsyncUserInfo,
  setAsyncCoord,
  setAsyncIsAddressed,
  setAsyncLocation,
  setAsyncToken,
} from "../../helper/asyncStorage";
import { setLocation } from "../../actions/locationAction";
import {
  addToCart,
  getAllExpertReview,
  getCartlist,
  getrefreshToken,
  getUserDetails,
} from "../../actions";
import FastImage from "react-native-fast-image";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import moment from "moment";
import { getExpertAvailability } from "../../actions/commonActions";
import { io } from "socket.io-client";
import { api } from "../../helper/apiConstants";
import { SafeAreaView } from "react-native-safe-area-context";
import { debounce, lowerFirst } from "lodash";
import ServiceSelect from "../../components/common/ServiceSelect";
import { Dropdown_Down_Arrow } from "../../theme/SvgIcon";
import messaging from "@react-native-firebase/messaging";

const Home = () => {
  const { navigate } = useNavigation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.common);
  const { defaultAddress } = useAppSelector((state) => state.address);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [costmodal, setCostmodal] = useState(false);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [servicesModal, setServicesModal] = useState(false);
  const [menservicesModal, setmenservicesModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [banner, setbanner] = useState([]);
  const [value, setValue] = useState("");
  const [maleData, setMaleData] = useState<any>([]);
  const [femaleData, setFemaleData] = useState<any>({});
  const [femaleBaseURL, setFemaleBaseURL] = useState<any>([]);
  const [maleBaseURL, setMaleBaseURL] = useState<any>([]);
  const [subServicesModalData, setSubServicesModalData] = useState<any>({});
  const [isSticky, setIsSticky] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [refreshControl, setRefreshControle] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [listLoader, setListLoader] = useState(false);
  const [selectedDateIndex, setSelectedDate] = useState(Number);
  const [selectedTimeIndex, setSelectedTime] = useState(Number);
  const [date, setDate] = useState("");
  const [bookTime, setBookTime] = useState({});
  const [ratingItem, setRatingItem] = useState<any>({});
  const [selectedService, setSelectedService] = useState<any>([]);
  const [selectedServiceModal, setSelectedServiceModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [image, setImage] = useState([]);
  const [deviceToken, setDeviceToken] = useState<string>("");
  const { selectedService: cartSelectedService } = useAppSelector(
    (state) => state?.cart
  );

  const { getallservices, userList, barberList, itemDetails } = useAppSelector(
    (state) => state.home
  );
  const [rating, setRating] = useState(null);
  const [gender, setGender] = useState(null);
  const [filter, setFilter] = useState(stylists_filter);
  const isInitialRender = useRef(true);

  useEffect(() => {
    const unsubscribe = onTokenRefreshListener();
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const socket = io(api.BASE_URL);
    // console.log(socket)
    socket.on("connect", () => {
      console.log("connect", socket.id);
    });
    return () => {
      socket.on("disconnect", () => {
        console.log("disconnect", socket.id);
      });
    };
  }, []);

  const onTokenRefreshListener = () => {
    return messaging()?.onTokenRefresh(async (newToken) => {
      if (newToken) {
        await setAsyncToken(newToken);
        setDeviceToken(JSON.stringify(newToken));
        console.log("New FCM Token:", JSON.stringify(newToken));
      }
    });
  };

  const getRefreshToken = async () => {
    let obj = {
      data: {},
      onSuccess: (response: any) => {
        console.log("Resssss", response);
      },
      onFailure: (Err: any) => {},
    };
    dispatch(getrefreshToken(obj));
  };

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url !== null) {
        console.log("DEEPLINK::", url);
        // let id = url.split("//")[1];
        // if (id.length > 0) {
        // }
      }
    });
    // Linking.addEventListener('url', ({url}) => {
    //   console.log('CAALALA hELO', url);
    // });
  }, []);

  useEffect(() => {
    if (cartSelectedService?.length == 0) {
      setSelectedService([]);
    }
  }, [cartSelectedService]);

  useEffect(() => {
    let banner = {
      onSuccess: (res: any) => {
        setbanner(res?.banners);
        let obj_female = {
          type: "Female",
          onSuccess: (response: any) => {
            setFemaleBaseURL(response?.featured_image_url);
            let outputData: any = [];
            for (let i = 0; i < response.services.length; i += 2) {
              outputData.push(response.services.slice(i, i + 2));
            }
            setFemaleData(outputData);
            let obj_male = {
              type: "Male",
              onSuccess: (response: any) => {
                setMaleBaseURL(response?.featured_image_url);
                let outputData: any = [];
                for (let i = 0; i < response.services.length; i += 2) {
                  outputData.push(response.services.slice(i, i + 2));
                }
                setMaleData(outputData);
                getUserList(true);
                setTimeout(() => {
                  GetStatus();
                }, 500);
              },
              onFailure: () => {},
            };
            dispatch(getAllServicesForMaleAndFemale(obj_male));
          },
          onFailure: () => {},
        };
        dispatch(getAllServicesForMaleAndFemale(obj_female));
      },
      onFailure: () => {},
    };
    dispatch(getAllBanner(banner));
  }, []);

  useEffect(() => {
    getProfileData();
    getDatesList();
  }, []);

  const getProfileData = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      isLoading: false,
      data: {
        userid: userInfo._id,
      },
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getUserDetails(obj));
  };

  const getCartData = async () => {
    let userInfo = await getAsyncUserInfo();
    let obj = {
      data: {
        userId: userInfo?._id,
      },
      onSuccess: (response) => {
        dispatch({ type: CART_DETAILS, payload: response?.data?.cart });
      },
      onFailure: () => {
        dispatch({ type: CART_DETAILS, payload: {} });
      },
    };
    dispatch(getCartlist(obj));
  };

  useFocusEffect(
    useCallback(() => {
      getCartData();
    }, [])
  );

  const getUserList = async (isLoading: boolean) => {
    await requestLocationPermission(
      async (response) => {
        let data = {
          latitude: response?.latitude || 76.7233438,
          longitude: response?.longitude || 30.6776689,
          maxDistance: 50000,
          page: page,
          limit: 5,
          rating: rating,
          gender: gender,
          service_id: [],
        };
        let obj = {
          isLoading: isLoading,
          data: data,
          onSuccess: () => {
            setFilterData(data);
            setPage(page + 1);
            setFooterLoading(false);
            setLoading(false);
          },
          onFailure: () => {},
        };
        dispatch(getUsersByLocation(obj));
      },
      (err) => {
        console.log("Home Location API", err);
      }
    );
  };

  const onPressRating = (isLoading: boolean, rating: number) => {
    let selected = cartSelectedService?.map((item) => item?._id);
    setListLoader(true);
    let data = {
      ...filterData,
      rating: rating,
      page: 1,
      service_id: selected,
    };

    let obj = {
      isLoading: isLoading,
      data: data,
      onSuccess: () => {
        setFilterData(data);
        setPage(page + 1);
        setFooterLoading(false);
        setListLoader(false);
      },
      onFailure: () => {
        setListLoader(false);
      },
    };
    dispatch(getUsersByLocation(obj));
  };

  const onPressBestService = () => {
    let selected = cartSelectedService?.map((item) => item?._id);
    setListLoader(true);
    let data = {
      ...filterData,
      best_service: "Yes",
      page: 1,
      service_id: selected,
    };
    let obj = {
      isLoading: isLoading,
      data: data,
      onSuccess: () => {
        setFilterData(data);
        setPage(page + 1);
        setFooterLoading(false);
        setListLoader(false);
      },
      onFailure: () => {
        setListLoader(false);
      },
    };
    dispatch(getUsersByLocation(obj));
  };

  const getDetails = (item: any) => {
    let userid = item?._id;
    let obj = {
      data: {
        userid: userid,
      },
      onSuccess: (res: any) => {
        if (selectedService?.length > 0) {
          onPressStylist(item?._id);
        } else {
          navigate(screenName.YourStylist, {
            id: item?._id,
          });
        }
      },
      onFailure: () => {},
    };
    dispatch(getUserItemDetails(obj));
  };

  const getCurrentLocation = async () => {
    let value = await getAsyncIsAddressed();
    dispatch({ type: IS_LOADING, payload: true });
    await requestLocationPermission(
      async (response) => {
        await getAddress(
          response,
          async (result: any) => {
            value === false &&
              (result?.results?.length
                ? await setAsyncLocation(
                    result?.results?.[0]?.formatted_address
                  )
                : await setAsyncLocation("Mohali,Punjab"));
            await GetStatus();
          },
          (err) => {
            console.log("map", err);
          }
        ).then(async (res) => {
          const coord = {
            latitude: Number(response?.latitude || 30.6776689),
            longitude: Number(response?.longitude || 76.7233438),
            maxDistance: 50000,
          };
          await setAsyncCoord(coord);
          dispatch({ type: COORD, payload: coord });
          dispatch({ type: IS_LOADING, payload: false });
          setLocationModal(false);
        });
      },
      (err) => {
        console.log("Home Location API", err);
      }
    );
  };

  useFocusEffect(
    useCallback(() => {
      getCurrentLocation();
    }, [])
  );

  const LocationAllow = async (city: any) => {
    city ? await setAsyncLocation(city) : await setAsyncLocation(null);
    GetStatus();
  };

  const GetStatus = async () => {
    const Status = await getAsyncLocation();
    Status ? setLocationModal(false) : setLocationModal(true);
    dispatch({ type: LOCATION, payload: Status });
    setValue(Status);
  };

  const onSnapToItem = (index: React.SetStateAction<number>) => {
    setActiveIndex(index);
  };

  const onPressItem = (item: any) => {
    getDetails(item);
    //@ts-ignore
  };

  const onPressReviewItem = (item: any) => {
    setReviewModal(true);
    setRatingItem({
      averageRating: item?.averageRating,
      jobDone: item?.jobDone,
      _id: item?._id,
    });
    let obj = {
      user_id: item?._id,
      params: {
        limit: 100,
        page: 1,
        sort: "newest",
      },
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAllExpertReview(obj));
  };

  const onPressRatingFilterItem = (index: number) => {
    let obj = {
      user_id: ratingItem?._id,
      params: {
        limit: 100,
        page: 1,
        sort: ReviewFilter?.[index].type,
      },
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAllExpertReview(obj));
  };

  const onPresstoNavigate = async (item: any) => {
    let coord = await getAsyncCoord();
    setServicesModal(false);
    setTimeout(() => {
      let data = {
        page: 1,
        limit: 100,
        maxDistance: 50000,
        sub_service_id: item?._id,
        latitude: coord.latitude,
        longitude: coord.longitude,
      };
      let obj = {
        data: data,
        onSuccess: () => {
          // @ts-ignore
          navigate(screenName.Service, {
            item: {
              ...item,
              imageUrl: subServicesModalData?.imageUrl + "/" + item?.fileName,
            },
            filterData: data,
          });
        },
        onFailure: (err: any) => {
          infoToast(err.data?.message);
        },
      };
      dispatch(getAllExpertBySubService(obj));
    }, 600);
  };

  const dateClear = (isLoading: boolean) => {
    let selected = cartSelectedService?.map((item) => item?._id);
    setListLoader(true);
    let data = {
      ...filterData,
      page: 1,
      dateTime: null,
      service_id: selected,
    };
    let obj = {
      isLoading: isLoading,
      data: data,
      onSuccess: () => {
        setFilterData(data);
        setPage(page + 1);
        setFooterLoading(false);
        setListLoader(false);
        dispatch({ type: TIME_SLOT, payload: {} });
      },
      onFailure: () => {
        setListLoader(false);
      },
    };
    dispatch(getUsersByLocation(obj));
  };

  const ratingClear = (isLoading: boolean) => {
    let selected = cartSelectedService?.map((item) => item?._id);
    setListLoader(true);
    let data = {
      ...filterData,
      page: 1,
      rating: null,
      service_id: selected,
    };
    let obj = {
      isLoading: isLoading,
      data: data,
      onSuccess: () => {
        setFilterData(data);
        setPage(page + 1);
        setFooterLoading(false);
        setListLoader(false);
        setRating(null);
      },
      onFailure: () => {
        setListLoader(false);
      },
    };
    dispatch(getUsersByLocation(obj));
  };

  const clearBestService = () => {
    let selected = cartSelectedService?.map((item) => item?._id);
    setListLoader(true);
    let data = {
      ...filterData,
      best_service: null,
      page: 1,
      service_id: selected,
    };
    let obj = {
      isLoading: isLoading,
      data: data,
      onSuccess: () => {
        setFilterData(data);
        setPage(page + 1);
        setFooterLoading(false);
        setListLoader(false);
      },
      onFailure: () => {
        setListLoader(false);
      },
    };
    dispatch(getUsersByLocation(obj));
  };

  const updateFilter = (index: number) => {
    let data = [...filter];
    data[index - 1].isSelected = true;
    setFilter([...data]);
  };

  const clearFilter = (index: number) => {
    let data = [...filter];
    data[index - 1].isSelected = false;
    setFilter([...data]);
  };

  const ModalHendler = (item: any) => {
    if (item == 1) {
      getDatesList();
      setIsModal(!isModal);
    } else if (item == 2) {
    } else if (item == 3) {
      setCostmodal(!costmodal);
    } else if (item == 4) {
      setRating(5);
      onPressRating(true, 5);
    } else if (item == 5) {
      onPressBestService();
    }
    updateFilter(item);
  };

  const onPressClose = (id: any) => {
    if (id == 1) {
      dateClear(true);
    } else if (id == 2) {
    } else if (id == 3) {
      // setCostmodal(!costmodal);
    } else if (id == 4) {
      ratingClear(true);
      setRating(null);
    } else if (id == 5) {
      clearBestService();
    }
    clearFilter(id);
  };

  const onPressDateItem = (index: any) => {
    setSelectedDate(index);
    setDate(dates[index].title);
    setTimes(dates[index].value);
    setSelectedTime(0);
  };

  const onPressTimeItem = (index: any) => {
    setSelectedTime(index);
    let bookDates = times[index];
    setBookTime(bookDates);
  };

  const onPressApplyDate = () => {
    let selected = cartSelectedService?.map((item) => item?._id);
    let time = {
      time: times[selectedTimeIndex]?.time,
      start_time_id: times[selectedTimeIndex]?._id,
    };
    setListLoader(true);

    let data = {
      ...filterData,
      page: 1,
      dateTime: {
        timeSlot_id: time,
        availableDate: date,
      },
      service_id: selected,
    };
    let obj = {
      isLoading: isLoading,
      data: data,
      onSuccess: () => {
        setFilterData(data);
        setPage(page + 1);
        setFooterLoading(false);
        setListLoader(false);
        dispatch({
          type: TIME_SLOT,
          payload:
            {
              timeSlot_id: times[selectedTimeIndex]?._id,
              availableTime: times[selectedTimeIndex]?.time,
              availableDate: date,
            } || {},
        });
      },
      onFailure: () => {
        setListLoader(false);
      },
    };
    dispatch(getUsersByLocation(obj));
  };

  const onPressSearch = () => {
    // @ts-ignore
    navigate(screenName.SearchItem);
  };

  const onPressLocation = () => {
    // @ts-ignore
    // navigate(screenName.Map_Location);
    navigate(screenName.SelectLocation);
  };

  const loadMoreData = () => {
    setFooterLoading(true);
    getUserList(false);
  };

  const debouncedLoadMoreData = debounce(loadMoreData, 500); // Adjust the delay as needed

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    // Check if the scroll offset is greater than or equal to the height of the sticky header
    setIsSticky(contentOffset.y >= 1700); // Adjust this value according to your header's height
    if (isCloseToBottom(event?.nativeEvent)) {
      debouncedLoadMoreData(); // Adjust the delay as needed
    }
  };

  const onPressServicesItem = (item: any) => {
    let data = {
      serviceIds: item?._id,
    };
    let obj = {
      data: data,
      onSuccess: (response: any) => {
        setSubServicesModalData(response);
        setModalTitle(item.service_name);
        setServicesModal(!servicesModal);
        CheckSelected(response);
      },
      onFailure: () => {},
    };
    dispatch(getAllSubServicesForMobile(obj));
  };

  const onPressStylist = async (expertId: any) => {
    navigate(screenName.YourStylist, {
      id: expertId,
      itemDetails: itemDetails,
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshControle(true);
    dispatch(getAllBanner(banner));
    setRefreshControle(false);
    getProfileData();
    getCartData();
  }, [refreshControl]);

  async function getDatesList() {
    let data = generateWeekDates(5);

    let obj = {
      data: {
        startDate: moment(data?.[0]?.date).format("YYYY-MM-DD"),
        endDate: moment(data?.[data?.length - 1]?.date).format("YYYY-MM-DD"),
        timeSlotDuration: 15,
        expertId: "61eed0259e6593d24b2a7215",
      },
      onSuccess: (response: any) => {
        let data = convertToOutput(response);
        setDates(data);
        let time = data?.[0]?.value;
        setDate(data[0]?.title);
        setTimes(data[0]?.value);

        let indexes = time
          ?.map((time: any, index: number) =>
            time?.isPast == false ? index : null
          )
          ?.filter((item) => item);
        setBookTime(time[indexes[0]]);
        setSelectedTime(indexes[0]);
      },
      onFailure: () => {},
    };
    dispatch(getExpertAvailability(obj));
  }

  const onPressViewAll = () => {
    // @ts-ignore
    navigate("StylistList");
  };

  const onPressSelect = (serivce: any) => {
    let services = [...subServicesModalData?.subServices];
    const selectedServices = services?.map((item) => {
      if (item?._id == serivce?._id) {
        if (item?.isSelected == true) {
          return { ...item, isSelected: false };
        } else {
          return { ...item, isSelected: true };
        }
      } else {
        if (item?.isSelected == true) {
          return { ...item, isSelected: true };
        } else {
          return { ...item, isSelected: false };
        }
      }
    });
    setSubServicesModalData({ subServices: selectedServices });
  };

  const onPressAddservice = () => {
    let services = [...subServicesModalData?.subServices];
    let selectedServiceIDs = new Set(
      selectedService?.flatMap((item) =>
        item?.subServices?.map((subItem) => subItem?._id)
      )
    );

    let uniqueSelectedServices = services
      ?.filter((item) => item.isSelected && !selectedServiceIDs.has(item?._id))
      ?.map((item) => {
        selectedServiceIDs.add(item?._id);
        return item;
      });

    if (uniqueSelectedServices?.length) {
      setSelectedService([
        ...selectedService,
        { subServices: uniqueSelectedServices },
      ]);
      if (selectedService?.length) {
        dispatch({
          type: SELECTED_SERVICE,
          payload: [
            ...selectedService?.flatMap((service) => service?.subServices),
            ...uniqueSelectedServices,
          ],
        });
      } else {
        dispatch({
          type: SELECTED_SERVICE,
          payload: [...selectedService, ...uniqueSelectedServices],
        });
      }
    }
  };

  const CheckSelected = (response: any) => {
    let selectedServices = response?.services?.[0]?.subServices?.map((item) => {
      let filteritem = selectedService
        ?.map((selectedItem) => {
          return selectedItem?.subServices?.filter(
            (items) => items?._id == item?._id
          );
        })
        ?.flat();
      if (filteritem?.length) {
        return filteritem[0];
      } else {
        return item;
      }
    });
    setSubServicesModalData({ subServices: selectedServices });
  };

  const onPressRemoveService = (service: any) => {
    let serviceClone = [...selectedService];

    const updatedSelectedServices = serviceClone
      ?.map((item) => {
        let filteredServices = item?.subServices?.filter(
          (subService) => subService?._id !== service?._id
        );
        return { ...item, subServices: filteredServices };
      })
      ?.filter((item) => item.subServices.length > 0);

    setSelectedService(updatedSelectedServices);
    setSubServicesModalData({
      subServices: updatedSelectedServices.flatMap((item) => item.subServices),
    });
    dispatch({
      type: SELECTED_SERVICE,
      payload: updatedSelectedServices.flatMap((item) => item.subServices),
    });
    if (updatedSelectedServices?.length == 0) {
      setSelectedService([]);
      dispatch({ type: SELECTED_SERVICE, payload: [] });
    }
  };

  useEffect(() => {
    setServicesModal(false);
    setSelectedServiceModal(false);
    if (isInitialRender?.current) {
      isInitialRender.current = false;
      return;
    }
    if (cartSelectedService?.length) {
      SelectedServiceExpert();
    } else {
      SelectedServiceExpert();
    }
  }, [cartSelectedService]);

  const SelectedServiceExpert = async () => {
    setListLoader(true);
    let selected = cartSelectedService?.map((item) => item?._id);
    let data = {
      ...filterData,
      rating: rating,
      service_id: selected,
      page: 1,
    };

    let obj = {
      isLoading: false,
      data: data,
      onSuccess: () => {
        setFilterData(data);
        setFooterLoading(false);
        setListLoader(false);
      },
      onFailure: (Err: any) => {
        console.log("Err", Err);
        setListLoader(false);
      },
    };
    dispatch(getUsersByLocation(obj));
  };

  const onPressImages = (item: any) => {
    setImage(item?.user_profile_images);
    setImageModal(!imageModal);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles?.container}>
      <LocationModal
        isVisible={locationModal}
        close={setLocationModal}
        onPressDontAllow={setCityModal}
        onPressAllow={getCurrentLocation}
      />
      {!cityModal ? null : <CityModal LocationAllow={LocationAllow} />}

      <ScrollView
        stickyHeaderIndices={[1, 7]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
        }
      >
        <HomeHeader
          edges={[]}
          onPressProfile={() => navigation.openDrawer()}
          onPressCart={() => navigate(screenName.Cart)}
          location={defaultAddress?.length ? defaultAddress : value}
          onPresslocation={onPressLocation}
          onPressLike={() => navigate(screenName.MyFavorites)}
          containerStyle={{ backgroundColor: colors.background_grey }}
        />
        <AnimatedSearchBars onPressSearch={onPressSearch} />

        <View style={styles.carousel_container}>
          {loading ? (
            <CarouselLoader />
          ) : (
            <Carousel
              layout={"default"}
              data={banner}
              sliderWidth={screen_width}
              itemWidth={screen_width}
              inactiveSlideScale={2}
              renderItem={({ item }: any) => {
                return (
                  <View>
                    <FastImage
                      source={{
                        uri: item?.imageUrl + "/" + item?.fileName,
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
          )}
        </View>
        <Pagination
          // @ts-ignore
          dotsLength={banner?.length}
          activeDotIndex={activeIndex}
          containerStyle={styles?.pagination_container}
          dotStyle={styles?.dotStyle}
          inactiveDotStyle={styles?.inactiveDotStyle}
          inactiveDotScale={1}
          dotContainerStyle={styles?.dotContainerStyle}
        />
        <View style={styles?.women_services_container}>
          <View style={styles?.title_container}>
            <Text style={styles?.services_title}>
              {strings?.Services_for_Women.slice(0, -5)}
            </Text>
            <Text style={styles?.title_bold}>
              {strings?.Services_for_Women.split(" ")[2]}
            </Text>
          </View>

          <View style={styles?.services_conatiner}>
            <FlatList
              horizontal
              data={femaleData}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={styles?.item_separator}></View>
              )}
              renderItem={({ item, index }: any) => {
                return (
                  <FlatList
                    scrollEnabled={false}
                    key={index}
                    data={item}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            onPressServicesItem(item);
                          }}
                          style={styles?.service_card_container}
                        >
                          {isLoading ? (
                            <SkeletonPlaceholder borderRadius={4}>
                              <SkeletonPlaceholder.Item alignItems="center">
                                <SkeletonPlaceholder.Item>
                                  <SkeletonPlaceholder.Item
                                    width={120}
                                    height={20}
                                    marginTop={hp(15)}
                                  />
                                </SkeletonPlaceholder.Item>
                              </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder>
                          ) : (
                            <Text style={styles?.card_title}>
                              {item?.service_name}
                            </Text>
                          )}

                          {isLoading ? (
                            <SkeletonPlaceholder borderRadius={4}>
                              <SkeletonPlaceholder.Item alignItems="center">
                                <SkeletonPlaceholder.Item
                                  width={hp(119)}
                                  height={hp(119)}
                                  borderRadius={10}
                                />
                              </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder>
                          ) : (
                            <FastImage
                              style={styles?.images}
                              source={{
                                uri: femaleBaseURL + "/" + item?.fileName,
                                priority: FastImage.priority.high,
                              }}
                              resizeMode="contain"
                            />
                          )}
                        </TouchableOpacity>
                      );
                    }}
                  />
                );
              }}
            />
          </View>
        </View>

        <View style={styles?.men_services_container}>
          <View style={styles?.title_container}>
            <Text style={styles?.services_title}>
              {strings?.Services_for_Men.slice(0, -3)}
            </Text>
            <Text style={styles?.title_bold}>
              {strings?.Services_for_Men.split(" ")[2]}
            </Text>
          </View>

          <View style={styles?.services_conatiner}>
            <FlatList
              horizontal
              data={maleData}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={styles?.item_separator}></View>
              )}
              renderItem={({ item, index }: any) => {
                return (
                  <FlatList
                    scrollEnabled={false}
                    key={index}
                    data={item}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            onPressServicesItem(item);
                          }}
                          style={styles?.service_card_container}
                        >
                          <Text style={styles?.card_title}>
                            {item?.service_name}
                          </Text>
                          <FastImage
                            style={styles?.images}
                            source={{
                              uri: maleBaseURL + "/" + item?.fileName,
                              priority: FastImage.priority.high,
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                );
              }}
            />
          </View>
        </View>

        <View style={styles?.your_stylists_container}>
          <View style={styles?.stylists_title_container}>
            <View style={styles?.title_border}></View>
            <Text style={styles?.your_stylists_title}>
              {strings?.YOUR_Stylists}
            </Text>
            <View style={styles?.title_border}></View>
          </View>
        </View>
        <View
          style={
            isSticky
              ? styles.stickyHeaderStyle
              : styles?.service_filter_conatiner
          }
        >
          <FlatList
            data={filter}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }: any) => {
              return (
                <Filter_Button
                  isSeleted={item.isSelected}
                  onPressClose={() => onPressClose(item.id)}
                  isCloseIcon={item.isSelected}
                  onPress={() => {
                    ModalHendler(item.id);
                  }}
                  containerStyle={
                    filter.length - 1 == index ? { marginRight: wp(10) } : null
                  }
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

        {listLoader ? (
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
          <View
            style={[
              styles?.barber_card_container,
              {
                paddingBottom:
                  selectedService?.length && !footerLoading && hp(40),
              },
            ]}
          >
            <FlatList
              data={barberList || []}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                let total = 0;
                let time = 0;
                cartSelectedService?.forEach((items) => {
                  item?.user_service_assignments?.forEach((service) => {
                    if (items?._id == service?.sub_service_id) {
                      {
                        total += service?.price;
                        time +=
                          service?.time_taken?.hours * 60 +
                          service?.time_taken?.minutes;
                      }
                    }
                  });
                });

                return (
                  <Barber_Card
                    data={item}
                    featured_image_url={userList?.featured_image_url}
                    name={item.name}
                    type="Without Service"
                    images={item?.user_profile_images}
                    rating={item.averageRating}
                    Is_show_Price_Time={selectedService?.length ? true : false}
                    jobs={item?.jobDone}
                    offers={item?.offers[0]?.discount}
                    onPress={() => onPressItem(item)}
                    time={time}
                    total={total}
                    onPressRating={() => onPressReviewItem(item)}
                    barberdetailscontinerStyle={
                      styles.barberdetailscontinerStyle
                    }
                    onPressImages={() => onPressImages(item)}
                  />
                );
              }}
              ItemSeparatorComponent={() => (
                <View style={styles.card_separator}></View>
              )}
            />
          </View>
        )}
        <View
          style={{
            paddingBottom: selectedService?.length && footerLoading && hp(50),
          }}
        >
          {footerLoading && <ActivityIndicator />}
        </View>
        <Modals
          visible={selectedServiceModal}
          close={setSelectedServiceModal}
          backdropColor="transparent"
          containStyle={styles.selectedmodalstyle}
          IsBackdropPress={false}
          contain={
            <View>
              <View style={styles.makeup_modal_container}>
                <View style={styles.card_conatiner}>
                  {selectedService?.map((service) => {
                    return service?.subServices?.map((subService) => {
                      return (
                        <ServiceSelect
                          onPress={() => onPressRemoveService(subService)}
                          type="delete"
                          service={subService?.sub_service_name}
                        />
                      );
                    });
                  })}
                </View>
              </View>
              <View style={styles.selectedmodalFooter}>
                <View style={styles.footerbar}>
                  <Text style={styles.filterTitle}>{"Apply filters"}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedServiceModal(!selectedServiceModal)
                    }
                    style={styles?.service}
                  >
                    <Text style={styles.servicecount}>{`${
                      selectedService?.flatMap((item) => item?.subServices)
                        ?.length
                    } Services`}</Text>
                    <View
                      style={[
                        styles.downIcon,
                        {
                          transform: [
                            {
                              rotate: !selectedServiceModal ? "180deg" : "0deg",
                            },
                          ],
                        },
                      ]}
                    >
                      <Dropdown_Down_Arrow width={10} height={8} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        />

        <SelectDateModal
          visible={isModal}
          close={setIsModal}
          dates={dates}
          onPressDateItem={(index: any) => onPressDateItem(index)}
          onPressTimeItem={(index: any) => onPressTimeItem(index)}
          setIsModal={setIsModal}
          times={times}
          selectedDateIndex={selectedDateIndex}
          selectedTimeIndex={selectedTimeIndex}
          onPressApply={onPressApplyDate}
          DateItem_style={styles.dateStyle}
          scrollEnabled={false}
          withOutDisable={false}
        />

        <Modals
          visible={costmodal}
          close={setCostmodal}
          contain={<CostModal visible={costmodal} close={setCostmodal} />}
        />

        <Modals
          visible={servicesModal}
          close={setServicesModal}
          containStyle={{ paddingHorizontal: 0 }}
          contain={
            <View>
              <View style={styles.makeup_modal_container}>
                <Text style={styles.modal_title}>{modalTitle}</Text>
                <View style={styles.card_conatiner}>
                  {subServicesModalData?.subServices?.map(
                    (subServices: any, index: number) => {
                      return (
                        <ServiceSelect
                          onPress={() => onPressSelect(subServices)}
                          type="select"
                          service={subServices?.sub_service_name}
                          selected={subServices?.isSelected}
                        />
                      );
                    }
                  )}
                </View>
              </View>
              <View style={styles.btn_container}>
                <TouchableOpacity
                  onPress={() => setServicesModal(!servicesModal)}
                  style={{ flex: 1 }}
                >
                  <ImageBackground
                    resizeMode="stretch"
                    source={images?.gery_button}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.btnTitle}>{"Cancel"}</Text>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onPressAddservice()}
                  style={{ flex: 1 }}
                >
                  <ImageBackground
                    resizeMode="stretch"
                    source={images?.blue_button}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.btnTitle}>{"Add Service"}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          }
        />

        <Modals
          visible={menservicesModal}
          close={setmenservicesModal}
          contain={
            <View>
              <View style={styles.makeup_modal_container}>
                <Text style={styles.modal_title}>{modalTitle}</Text>
                <View style={styles.card_conatiner}>
                  {getallservices?.map((item, index) =>
                    item.service_for == "Male"
                      ? item?.subServices?.map((subServices, indes) => {
                          return (
                            <ServiceSelect
                              onPress={() => onPresstoNavigate(subServices)}
                              type="select"
                              service={subServices?.sub_service_name}
                              selected={subServices?.isSelected}
                            />
                          );
                        })
                      : null
                  )}
                </View>
              </View>
              <View style={styles.btn_container}>
                <TouchableOpacity
                  onPress={() => setServicesModal(!servicesModal)}
                  style={{ flex: 1 }}
                >
                  <ImageBackground
                    resizeMode="stretch"
                    source={images?.gery_button}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.btnTitle}>{"Cancel"}</Text>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onPressAddservice()}
                  style={{ flex: 1 }}
                >
                  <ImageBackground
                    resizeMode="stretch"
                    source={images?.blue_button}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.btnTitle}>{"Add Service"}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          }
        />

        <Modals
          visible={imageModal}
          close={setImageModal}
          containStyle={styles.imgmodalcontainStyle}
          containerStyle={styles.imgcontainer_style}
          contain={
            <View>
              <View style={styles.modal_carousel_img}>
                <Carousel
                  layout={"default"}
                  data={image}
                  sliderWidth={wp(320)}
                  itemWidth={wp(320)}
                  itemHeight={hp(573)}
                  sliderHeight={hp(573)}
                  inactiveSlideScale={1}
                  autoplay={false}
                  renderItem={({ item }: any) => {
                    return (
                      <View style={styles?.carousel_img_container}>
                        <FastImage
                          source={{
                            uri: api?.IMG_URL_2 + "/" + item?.image,
                            priority: FastImage.priority.high,
                          }}
                          style={[
                            {
                              height: hp(573),
                              width: wp(320),
                            },
                          ]}
                          resizeMode="cover"
                        />
                      </View>
                    );
                  }}
                  onSnapToItem={onSnapToItem}
                />
              </View>
              <Pagination
                dotsLength={images?.length}
                activeDotIndex={activeIndex}
                containerStyle={styles?.pagination_container}
                dotStyle={styles?.dotStyle}
                inactiveDotStyle={styles?.inactiveDotStyle}
                inactiveDotScale={1}
                dotContainerStyle={styles?.dotContainerStyle}
              />
            </View>
          }
        />

        <Modals
          isIcon
          visible={reviewModal}
          close={setReviewModal}
          contain={
            <ReviewModal
              ratingItem={ratingItem}
              onPressFilterItem={onPressRatingFilterItem}
            />
          }
          containStyle={{ maxHeight: "80%" }}
        />
      </ScrollView>
      {selectedService?.length && !selectedServiceModal ? (
        <View style={styles.selectedFooter}>
          <View style={styles.footerbar}>
            <Text style={styles.filterTitle}>{"Apply filters"}</Text>
            <TouchableOpacity
              onPress={() => setSelectedServiceModal(!selectedServiceModal)}
              style={styles?.service}
            >
              <Text style={styles.servicecount}>{`${
                selectedService?.flatMap((item) => item?.subServices)?.length
              } Services`}</Text>
              <View
                style={[
                  styles.downIcon,
                  {
                    transform: [
                      { rotate: !selectedServiceModal ? "180deg" : "0deg" },
                    ],
                  },
                ]}
              >
                <Dropdown_Down_Arrow width={10} height={8} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_grey,
  },
  search_box: {
    width: "100%",
    backgroundColor: colors?.white,
    borderWidth: 1,
    height: hp(41),
    borderColor: colors?.gray_border,
    borderRadius: wp(8),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: wp(10),
  },
  search_container: {
    paddingHorizontal: wp(20),
    paddingVertical: hp(9),
    backgroundColor: colors.background_grey,
  },
  search_icon: {
    width: wp(24),
    height: wp(24),
    marginLeft: wp(16),
  },
  input: {
    marginLeft: wp(5),
  },
  carousel_img: {
    width: "100%",
    height: hp(467),
    backgroundColor: colors.grey_19,
  },
  carousel_img_container: {
    overflow: "hidden",
    backgroundColor: colors.grey_19,
    height: hp(573),
    width: wp(320),
  },
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
  women_services_container: {
    paddingLeft: wp(20),
    marginTop: hp(36),
  },
  title_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  services_title: {
    ...commonFontStyle(fontFamily.regular, 20, colors?.black),
  },
  title_bold: {
    ...commonFontStyle(fontFamily.semi_bold, 20, colors?.black),
  },
  services_conatiner: {
    marginTop: hp(19),
  },
  service_card_container: {
    borderWidth: 1,
    borderColor: colors?.light_gray_border,
    backgroundColor: colors?.white,
    width: wp(150),
    height: hp(170),
    borderRadius: wp(8),
    justifyContent: "space-between",
    marginRight: wp(10),
    marginBottom: hp(10),
    marginTop: hp(10),
  },
  card_title: {
    ...commonFontStyle(fontFamily.medium, 12, colors?.black),
    marginTop: hp(11),
    marginLeft: wp(14),
  },
  images: {
    width: "100%",
    height: hp(119),
    alignSelf: "center",
  },
  item_separator: {
    width: wp(2),
  },
  men_services_container: {
    paddingLeft: wp(20),
    marginTop: hp(45),
  },
  your_stylists_container: {
    marginTop: hp(45),
  },
  title_border: {
    width: "100%",
    borderBottomWidth: hp(1),
    borderColor: colors?.stylists_border_color,
    marginHorizontal: wp(10),
    alignSelf: "center",
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
    ...commonFontStyle(fontFamily.medium, 17, colors?.stylists_title_gray),
    paddingHorizontal: wp(16),
  },
  service_filter_conatiner: {
    paddingLeft: wp(20),
    paddingBottom: hp(10),
    backgroundColor: colors.background_grey,
  },
  stickyHeaderStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    zIndex: 10,
    paddingLeft: wp(20),
    paddingBottom: hp(10),
    backgroundColor: colors.background_grey,
    marginTop: hp(40),
  },
  filter_item_separator: {
    width: wp(7),
  },
  barber_card_container: {
    marginHorizontal: wp(20),
    marginTop: hp(20),
    flex: 1,
  },
  card_separator: {
    height: hp(24),
  },
  carousel_container: {
    width: "100%",
    borderRadius: wp(12),
    overflow: "hidden",
  },
  select_date_title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
    marginTop: hp(20),
    paddingHorizontal: wp(10),
  },
  time_container: {
    marginTop: hp(31),
    paddingHorizontal: wp(10),
  },
  time_title: {
    ...commonFontStyle(fontFamily.semi_bold, 18, colors.black),
  },
  info: {
    ...commonFontStyle(fontFamily.regular, 13.3, colors.info_grey),
    alignSelf: "center",
    marginTop: hp(25),
    // marginHorizontal: wp(15),
  },
  btn_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(27),
    marginTop: hp(41),
    paddingHorizontal: wp(25),
    gap: wp(13),
    backgroundColor: colors?.white,
  },

  btn_style: {
    height: hp(60),
    width: wp(150),
    justifyContent: "center",
    alignItems: "center",
  },
  btn_tite: {
    ...commonFontStyle(fontFamily.medium, 18, colors.black),
  },
  date_container: {
    width: "100%",
  },
  select_date_container: {
    width: "100%",
  },
  week_container: {
    marginHorizontal: wp(10),
    marginTop: hp(16),
  },
  item_style: {
    width: wp(62),
    height: hp(70),
  },
  timeslot_style: {
    marginBottom: hp(16),
  },
  service_modal_container: {},
  modal_title: {
    ...commonFontStyle(fontFamily.semi_bold, 24, colors.black),
    marginBottom: hp(11),
  },
  makeup_card_container: {
    borderWidth: 1,
    borderColor: colors?.light_gray_border,
    backgroundColor: colors?.white,
    width: wp(100),
    height: hp(120),
    borderRadius: wp(8),
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  makeup_images: {
    width: wp(87),
    height: hp(77.26),
    marginTop: hp(3),
  },
  makeup_title: {
    ...commonFontStyle(fontFamily.medium, 12, colors?.black),
    textAlign: "center",
    marginTop: hp(7),
  },
  makeup_modal_container: {
    paddingHorizontal: wp(22),
  },
  card_conatiner: {
    gap: wp(30),
    justifyContent: "flex-start",
    marginTop: hp(10),
  },
  searchTextStyle: {
    ...commonFontStyle(fontFamily.medium, 12, "#949495"),
  },
  barberdetailscontinerStyle: {
    // marginTop: hp(20),
  },
  footerBtnStyle: {
    padding: wp(15),
    backgroundColor: colors.primary_light_blue,
    alignSelf: "center",
    marginVertical: hp(10),
    borderRadius: 10,
    paddingHorizontal: wp(20),
  },
  footerBtnTextStyle: {
    ...commonFontStyle(fontFamily.semi_bold, 12, colors.black),
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTitle: {
    ...commonFontStyle(fontFamily?.semi_bold, 18, colors?.stylists_title_gray),
    paddingVertical: hp(20),
  },
  selectedFooter: {
    backgroundColor: colors?.white,
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 11,
  },
  footerbar: {
    backgroundColor: colors?.primary_light_blue,
    marginHorizontal: wp(20),
    marginBottom: hp(10),
    marginTop: hp(4),
    paddingVertical: hp(10),
    paddingHorizontal: wp(16),
    justifyContent: "space-between",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  filterTitle: {
    ...commonFontStyle(fontFamily?.medium, 12, colors?.stylists_title_gray),
  },
  service: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(9),
  },
  servicecount: {
    ...commonFontStyle(fontFamily?.medium, 14, colors?.stylists_title_gray),
  },
  downIcon: {
    top: 1,
  },
  selectedmodalFooter: {
    backgroundColor: colors?.white,
    flex: 1,
    width: "100%",
    marginTop: hp(20),
  },
  selectedmodalstyle: {
    paddingVertical: 0,
    paddingTop: hp(24),
    marginBottom: hp(screen_height * 0.08),
    paddingHorizontal: 0,
  },
  dateStyle: {
    width: wp(50),
    height: hp(60),
  },
  modal_carousel_img: {
    width: wp(320),
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  imgmodalcontainStyle: {
    paddingHorizontal: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  imgcontainer_style: {
    justifyContent: "center",
    alignSelf: "center",
  },
});
