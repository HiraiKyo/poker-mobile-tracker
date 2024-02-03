import {
  Dimensions,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Image,
  Pressable,
} from "react-native";

import { Text, View } from "../../components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { Card, Layout } from "@ui-kitten/components";
import { router } from "expo-router";

// TODO: トップページロゴ作成

export default () => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <FontAwesome
          size={64}
          color={Colors[colorScheme ?? "light"].text}
          name="book"
          style={styles.logo}
        />
        <Text style={styles.subtitle}>あなたのポーカー収支を管理します</Text>
        <View style={styles.separator}></View>
        <Text style={styles.title}>収支を管理するために</Text>
        <View style={styles.cardLayout}>
          <Pressable
            style={styles.cardWrapper}
            onPress={() => router.push("/summary")}
          >
            {({ pressed }) => (
              <Card
                style={[styles.card, { opacity: pressed ? 0.5 : 1 }]}
                status={"primary"}
                header={GraphHeader}
              >
                <Text style={styles.cardContent}>グラフで確認</Text>
              </Card>
            )}
          </Pressable>
          <Pressable
            style={styles.cardWrapper}
            onPress={() => router.push("/summary")}
          >
            {({ pressed }) => (
              <Card
                style={[styles.card, { opacity: pressed ? 0.5 : 1 }]}
                status={"info"}
                header={ChartHeader}
              >
                <Text style={styles.cardContent}>ステークス別戦績</Text>
              </Card>
            )}
          </Pressable>
          <Pressable
            style={styles.cardWrapper}
            onPress={() => router.push("/sessions")}
          >
            {({ pressed }) => (
              <Card
                style={[styles.card, { opacity: pressed ? 0.5 : 1 }]}
                status={"success"}
                header={ListHeader}
              >
                <Text style={styles.cardContent}>収支データを編集</Text>
              </Card>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
const GraphHeader = () => (
  <Image
    style={styles.cardHeader}
    source={require("../../assets/images/card/graph.jpg")}
    resizeMode={"cover"}
  />
);
const ChartHeader = () => (
  <Image
    style={styles.cardHeader}
    source={require("../../assets/images/card/chart.jpg")}
    resizeMode={"cover"}
  />
);
const ListHeader = () => (
  <Image
    style={styles.cardHeader}
    source={require("../../assets/images/card/list.jpg")}
    resizeMode={"cover"}
  />
);
const sideMargin = 40;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  scrollView: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollItem: {
    width: Dimensions.get("window").width - 2 * sideMargin,
    alignContent: "center",
    gap: 4,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  logo: {
    marginVertical: 40,
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    borderWidth: 1,
    borderColor: "#999",
    width: "90%",
  },
  cardLayout: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
  },
  card: {
    padding: 0,
    flex: 1,
  },
  cardWrapper: {
    margin: 2,
    width: "40%",
    height: 240,
  },
  cardHeader: {
    width: Dimensions.get("window").width / 2 - sideMargin,
    height: 160,
  },
  cardContent: {
    textAlign: "center",
  },
});
