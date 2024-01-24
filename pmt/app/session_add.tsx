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
import { Controller, useForm } from "react-hook-form";
import Colors from "../constants/Colors";
import Session_at from "../components/form/session/session_at";
import { Session } from "../types/session";
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
        <Stakes_code selectStake={selectStake} />
        {stake ? <SessionAdd stake={stake} /> : <StakeAdd />}
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    alignItems: "center",
    justifyContent: "center",
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
