import {
  FlatList,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BackHeader } from "../../components";
import { screenName } from "../../helper/routeNames";
import { strings } from "../../helper/string";
import { DashIcon, PlusIcon } from "../../theme/SvgIcon";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getAllFAQ } from "../../actions/profileAction";

const FaQ = () => {
  const [expanded, setExpanded] = useState(0);
  const dispatch = useAppDispatch();
  const { getallfaqs } = useAppSelector((state) => state.profile);
  useEffect(() => {
    dispatch(getAllFAQ());
  }, []);

  const onPressFaQ = (id: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expanded == id) {
      setExpanded(0);
    } else {
      setExpanded(id);
    }
  };
  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings.FAQ} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.faq_container}
      >
        <FlatList
          data={getallfaqs?.faqs}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item?._id}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => onPressFaQ(item._id)}
                  style={[
                    expanded == item._id
                      ? [
                          styles.faq_list,
                          {
                            borderBottomRightRadius: wp(0),
                            borderBottomLeftRadius: wp(0),
                          },
                        ]
                      : styles.faq_list,
                  ]}
                >
                  <Text style={styles.faq_title}>{item.FaqTitle}</Text>
                  {expanded == item._id ? <DashIcon /> : <PlusIcon />}
                </TouchableOpacity>
                {expanded == item._id ? (
                  <View style={styles.faqSection}>
                    <Text style={styles.ans}>{item.FaqAnswer}</Text>
                  </View>
                ) : null}
              </View>
            );
          }}
          ListFooterComponent={<View style={{ marginTop: hp(20) }}></View>}
          ListHeaderComponent={<View style={{ marginTop: hp(20) }}></View>}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
        />
      </ScrollView>
    </View>
  );
};

export default FaQ;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  faq_container: {
    marginHorizontal: wp(20),
  },
  faq_title: {
    ...commonFontStyle(fontFamily.medium, 16, colors.black),
  },
  faq_list: {
    backgroundColor: colors.primary_light_blue_5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(20),
    paddingVertical: hp(18),
    borderRadius: wp(12),
    alignItems: "center",
  },
  separator: {
    height: hp(20),
  },
  faqSection: {
    width: "100%",
    paddingHorizontal: wp(20),
    paddingVertical: hp(10),
    backgroundColor: colors.white,
    borderBottomLeftRadius: wp(12),
    borderBottomRightRadius: wp(12),
  },
  ans: {
    ...commonFontStyle(fontFamily.regular, 15, colors.black),
    lineHeight: hp(20),
  },
});
