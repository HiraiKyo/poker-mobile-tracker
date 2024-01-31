import {
  Icon,
  IconElement,
  Menu,
  MenuItem,
  styled,
} from "@ui-kitten/components";
import {
  StyleSheet,
  ScrollView,
  Button,
  Pressable,
  GestureResponderEvent,
  useColorScheme,
  Alert,
} from "react-native";

import { Text, View } from "../../components/Themed";
import { database } from "../_layout";
import { useData } from "../../context/dataContext";
import { Setting } from "../../components/setting/setting-section";

export default () => {
  const colorScheme = useColorScheme();
  const { reload, reloadStakes } = useData();

  const onDeleteDataHandler = async () => {
    // TODO: 確認ダイアログ表示
    database.resetAll(() => {
      reload();
      reloadStakes();
    });
    Alert.alert("データが初期化されました。 ");
  };

  return (
    <View style={styles.container}>
      <Setting
        title={"データ初期化"}
        line={{
          type: "button",
          action: onDeleteDataHandler,
          buttonLabel: "消去",
          status: "danger",
          description:
            "データを初期化します。この操作は元に戻せないため、慎重に行ってください。",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },
  menu: {
    flex: 1,
    margin: 8,
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

/** アイコン */
const ForwardIcon = ({ color }: { color: string }): IconElement => (
  <Icon color name="arrow-ios-forward" />
);

/**
 * メニューリスト
 */
const menuItems = [
  {
    title: "データ管理",
    icon: <ForwardIcon color={"#999"} />,
  },
];
