import { Icon, IconElement, Menu, MenuItem } from "@ui-kitten/components";
import { StyleSheet, ScrollView } from "react-native";

import { Text, View } from "../../components/Themed";

export default () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Menu>
          <MenuItem title={"データベース消去"}>
            <View>
              <Text></Text>
            </View>
          </MenuItem>
        </Menu>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
