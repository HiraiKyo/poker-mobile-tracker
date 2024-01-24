import { FontAwesome } from "@expo/vector-icons";
import { Icon, IconElement, Menu, MenuItem } from "@ui-kitten/components";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native";

export default () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Menu>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              title={item.title}
              accessoryRight={item.icon}
            />
          ))}
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
  <FontAwesome
    name="arrow-right"
    size={25}
    color={color}
    style={{ marginRight: 15 }}
  />
);

/**
 * メニューリスト
 */
const menuItems = [
  {
    title: "データ管理",
    icon: <ForwardIcon color={"#999"} />,
    href: "/setting/database",
  },
];
