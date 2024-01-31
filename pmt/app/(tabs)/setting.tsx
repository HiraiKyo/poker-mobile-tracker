import { FontAwesome } from "@expo/vector-icons";
import { IconElement, Menu, MenuItem } from "@ui-kitten/components";
import { View, useColorScheme } from "react-native";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { Route, useRouter } from "expo-router";

export default () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const onPressHandler = (href: Route<string>) => {
    router.push(href);
  };

  return (
    <View style={styles.container}>
      <Menu
        style={[
          styles.menu,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            title={item.title}
            accessoryRight={item.icon}
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }}
            onPress={() => onPressHandler(item.href)}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    flex: 1,
    margin: 8,
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
 * メニュー型
 */
type MenuType = {
  title: string;
  icon: IconElement;
  href: Route<string>;
};

/**
 * メニューリスト
 */
const menuItems: MenuType[] = [
  {
    title: "データ管理",
    icon: <ForwardIcon color={"#999"} />,
    href: "/setting/database",
  },
];
