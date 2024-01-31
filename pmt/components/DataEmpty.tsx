import React from "react";
import { View, Text } from "./Themed";
import { Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Button } from "@ui-kitten/components";

export const DataEmpty = () => {
  return (
    <React.Fragment>
      <View style={styles.container}>
        <Text style={styles.title}>データが見つからないようです...</Text>
        <Text style={styles.title}>最初のセッションを記録しましょう！</Text>
        <View style={styles.buttonWrapper}>
          <Link href="/session_add" asChild>
            <Button status="primary">セッションを記録する</Button>
          </Link>
        </View>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
  },
  buttonWrapper: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});
