import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { BackHeader } from "../../components";
import { screenName } from "../../helper/routeNames";
import { strings } from "../../helper/string";
import { DashIcon, PlusIcon } from "../../theme/SvgIcon";
import { colors } from "../../theme/color";
import { hp, wp } from "../../helper/globalFunction";
import { commonFontStyle, fontFamily } from "../../theme/fonts";

const FaQ = () => {
  const [expanded, setExpanded] = useState(0);

  const onPressFaQ = (id: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expanded == id) {
      setExpanded(0);
    } else {
      setExpanded(id);
    }
  };

  const questions = [
    {
      id: 1,
      question: strings["What are your hours of operation?"],
      ans: strings[
        "Our barbershop operates from 10 AM to 9 PM, Monday through Saturday. We're closed on Sundays. You can book appointments online or give us a call during our operating hours. Walk-ins are also welcome, but appointments are recommended to ensure availability. Please note that our hours may vary during holidays or special occasions."
      ],
    },
    {
      id: 2,
      question: strings["What are your hours of operation?"],
      ans: strings[
        "Our barbershop operates from 10 AM to 9 PM, Monday through Saturday. We're closed on Sundays. You can book appointments online or give us a call during our operating hours. Walk-ins are also welcome, but appointments are recommended to ensure availability. Please note that our hours may vary during holidays or special occasions."
      ],
    },
    {
      id: 3,
      question: strings["What are your hours of operation?"],
      ans: strings[
        "Our barbershop operates from 10 AM to 9 PM, Monday through Saturday. We're closed on Sundays. You can book appointments online or give us a call during our operating hours. Walk-ins are also welcome, but appointments are recommended to ensure availability. Please note that our hours may vary during holidays or special occasions."
      ],
    },
    {
      id: 4,
      question: strings["What are your hours of operation?"],
      ans: strings[
        "Our barbershop operates from 10 AM to 9 PM, Monday through Saturday. We're closed on Sundays. You can book appointments online or give us a call during our operating hours. Walk-ins are also welcome, but appointments are recommended to ensure availability. Please note that our hours may vary during holidays or special occasions."
      ],
    },
    {
      id: 5,
      question: strings["What are your hours of operation?"],
      ans: strings[
        "Our barbershop operates from 10 AM to 9 PM, Monday through Saturday. We're closed on Sundays. You can book appointments online or give us a call during our operating hours. Walk-ins are also welcome, but appointments are recommended to ensure availability. Please note that our hours may vary during holidays or special occasions."
      ],
    },
    {
      id: 6,
      question: strings["What are your hours of operation?"],
      ans: strings[
        "Our barbershop operates from 10 AM to 9 PM, Monday through Saturday. We're closed on Sundays. You can book appointments online or give us a call during our operating hours. Walk-ins are also welcome, but appointments are recommended to ensure availability. Please note that our hours may vary during holidays or special occasions."
      ],
    },
    {
      id: 7,
      question: strings["What are your hours of operation?"],
      ans: strings[
        "Our barbershop operates from 10 AM to 9 PM, Monday through Saturday. We're closed on Sundays. You can book appointments online or give us a call during our operating hours. Walk-ins are also welcome, but appointments are recommended to ensure availability. Please note that our hours may vary during holidays or special occasions."
      ],
    },
    {
      id: 8,
      question: strings["What are your hours of operation?"],
      ans: strings[
        "Our barbershop operates from 10 AM to 9 PM, Monday through Saturday. We're closed on Sundays. You can book appointments online or give us a call during our operating hours. Walk-ins are also welcome, but appointments are recommended to ensure availability. Please note that our hours may vary during holidays or special occasions."
      ],
    },
  ];

  return (
    <View style={styles.conatiner}>
      <BackHeader title={strings.FAQ} />
      <View style={styles.faq_container}>
        <FlatList
          data={questions}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => onPressFaQ(item.id)}
                  style={[
                    expanded == item.id
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
                  <Text style={styles.faq_title}>{item.question}</Text>
                  {expanded == item.id ? <DashIcon /> : <PlusIcon />}
                </TouchableOpacity>
                {expanded == item.id ? (
                  <View style={styles.faqSection}>
                    <Text style={styles.ans}>{item.ans}</Text>
                  </View>
                ) : null}
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
        />
      </View>
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
    marginTop: hp(25),
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
