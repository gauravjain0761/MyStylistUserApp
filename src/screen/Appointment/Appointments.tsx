import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import DrawerHeader from "../../components/common/DrawerHeader";
import { strings } from "../../helper/string";
import { Barber_Card } from "../../components";
import { barbers } from "../../helper/constunts";
import BarberAppointmentCard from "../../components/common/BarberAppointmentCard";

const Appointments = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <DrawerHeader
        onPressManu={() => navigation.openDrawer()}
        title={strings.Your_Appointments}
      />
      <BarberAppointmentCard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
});

export default Appointments;
