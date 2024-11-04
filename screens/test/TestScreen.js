import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export const TestScreen = () => {
  return (
    <View style={styles.container}>
      <Text>TestScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});