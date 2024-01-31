import { StatusBar } from "expo-status-bar";
import {
  Button,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";

import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import SessionAdd from "../components/form/sessionAdd";
import StakeAdd from "../components/form/stakeAdd";
import Stakes_code from "../components/form/stakes_code";
import { Stake } from "../types/stake";
import { useState } from "react";

export default () => {
  const [stake, setStake] = useState<Stake | undefined>(undefined);
  const selectStake = (stake: Stake | undefined) => {
    if (stake) {
      //　既存ステークスにセッション追加フォーム
      setStake(stake);
    } else {
      // ステークス新規登録を含むセッション追加フォーム
      setStake(undefined);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.scrollItem}>
          <Stakes_code selectStake={selectStake} />
        </View>
        {stake ? <SessionAdd stake={stake} /> : <StakeAdd />}
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </ScrollView>
    </View>
  );
};

const sideMargin = 40;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollItem: {
    width: Dimensions.get("window").width - 2 * sideMargin,
    alignContent: "center",
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  label: {
    color: "white",
    margin: 5,
    marginLeft: 0,
  },
});
