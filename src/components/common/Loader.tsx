import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { colors } from "../../theme/color";

type Props = {};

const Loader = ({ visible = false }) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        <ActivityIndicator size={"large"} color={colors.white} />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
