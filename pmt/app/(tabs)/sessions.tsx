import {
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";
import { ReactNode, useEffect } from "react";
import { useData } from "../../context/dataContext";
import { SessionWithStake } from "../../types/session";
import { database } from "../_layout";

export default () => {
  const colorScheme = useColorScheme();
  const { data, reload } = useData(); // TODO: もっと見る… ボタンは一時的にreloadボタンになってる

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={styles.title}>セッション一覧</Text>
          <View style={{ justifyContent: "center", gap: 4 }}>
            <RoundedLabel
              backgroundColor={Colors[colorScheme ?? "light"].mainBg}
            >
              <Text
                style={[
                  styles.sessionDateSeparator,
                  { color: Colors[colorScheme ?? "light"].text },
                ]}
              >
                今日
              </Text>
            </RoundedLabel>
            {data.map((sessionWithStake, index) => (
              <RoundedLabel
                key={index}
                backgroundColor={Colors[colorScheme ?? "light"].mainBg}
              >
                <SessionSummary sessionWithStake={sessionWithStake} />
              </RoundedLabel>
            ))}
            <Pressable onPress={reload}>
              {({ pressed }) => (
                <Text
                  style={[
                    styles.button,
                    {
                      color: Colors[colorScheme ?? "light"].text,
                      backgroundColor: pressed
                        ? "#666"
                        : Colors[colorScheme ?? "light"].mainBg,
                    },
                  ]}
                >
                  もっと見る...
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {/** 新しいセッション追加ボタン */}
      <Link href="/session_add" style={styles.buttonStyle} asChild>
        <Pressable>
          {({ pressed }) => (
            <CircleBorder
              size={66}
              borderWidth={0}
              borderColor="black"
              backgroundColor={Colors[colorScheme ?? "light"].textGreen}
            >
              <FontAwesome
                name="plus"
                size={35}
                color={Colors[colorScheme ?? "light"].text}
                style={[{ opacity: pressed ? 0.5 : 1 }]}
              />
            </CircleBorder>
          )}
        </Pressable>
      </Link>
    </View>
  );
};

/**
 * スタイル記述エリア start
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonStyle: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  button: {
    fontSize: 32,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  // セッション一覧用
  sessionDateSeparator: {
    fontSize: 12,
  },
});

const sideMargin = 40; //

/**
 * スタイル記述エリア end
 */

/** === 単発コンポーネント === */

/**
 * セッションコンポーネント
 * TODO: 横幅がなぜか画面幅準拠にならない。横幅どうするか？
 * TODO: 長い時に折り返しするように
 */
const SessionSummary = ({
  sessionWithStake,
}: {
  sessionWithStake: SessionWithStake;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
        width: Dimensions.get("window").width - 2 * sideMargin,
        backgroundColor: Colors[colorScheme ?? "light"].mainBg,
      }}
    >
      <View
        style={{
          rowGap: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
          backgroundColor: Colors[colorScheme ?? "light"].mainBg,
        }}
      >
        {/** Stakes, Poker Sites */}
        <Text
          style={{
            fontSize: 18,
            backgroundColor: Colors[colorScheme ?? "light"].mainBg,
          }}
        >
          {sessionWithStake.stakes_name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginStart: 10,
            backgroundColor: Colors[colorScheme ?? "light"].mainBg,
          }}
        >
          {"$"}
          {sessionWithStake.sb}
          {"/"}
          {"$"}
          {sessionWithStake.bb}
        </Text>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors[colorScheme ?? "light"].mainBg,
          }}
        ></View>
      </View>
      <View
        style={{
          rowGap: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
          backgroundColor: Colors[colorScheme ?? "light"].mainBg,
        }}
      >
        {/** Date, Time */}
        <Text
          style={{
            fontSize: 12,
            backgroundColor: Colors[colorScheme ?? "light"].mainBg,
          }}
        >
          {sessionWithStake.session_at === ""
            ? sessionWithStake.created_at
            : sessionWithStake.session_at}
        </Text>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors[colorScheme ?? "light"].mainBg,
          }}
        ></View>
      </View>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
          backgroundColor: Colors[colorScheme ?? "light"].mainBg,
        }}
      >
        {/** Hands, Won BB, Won Chips*/}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "500",
            backgroundColor: Colors[colorScheme ?? "light"].mainBg,
          }}
        >
          {sessionWithStake.hands_amount} Hands
        </Text>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors[colorScheme ?? "light"].mainBg,
          }}
        ></View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "500",
            color: Colors[colorScheme ?? "light"].textGreen,
            marginStart: 10,
            backgroundColor: Colors[colorScheme ?? "light"].mainBg,
          }}
        >
          {sessionWithStake.win_amount / sessionWithStake.bb} BB (
          {sessionWithStake.win_amount} {"$"})
        </Text>
      </View>
    </View>
  );
};

/**
 * 丸枠テキスト
 */
const RoundedLabel = ({
  backgroundColor,
  children,
}: {
  backgroundColor: string;
  children: ReactNode;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          borderRadius: 6,
          paddingHorizontal: 6,
          paddingVertical: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        {children}
      </View>
    </View>
  );
};

/**
 * 円形アイコン
 * @param param0
 * @returns
 */
const CircleBorder = ({
  size,
  borderWidth,
  borderColor,
  backgroundColor,
  children,
}: {
  size: number;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  children: ReactNode;
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: 0.5 * size,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderColor,
      borderWidth,
      backgroundColor,
    }}
  >
    {children}
  </View>
);
