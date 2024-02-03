import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, StyleProp, TextStyle, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import App from "../../constants/Description";
import Description from "../../constants/Description";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * LOGO ICON
 * TODO: ロゴアイコン作成
 */
const LogoIcon = (props: { style: StyleProp<TextStyle> }) => {
  const colorScheme = useColorScheme();

  return (
    <FontAwesome
      size={25}
      {...props}
      color={Colors[colorScheme ?? "light"].text}
      name="book"
    />
  );
};
/**
 * ヘッダーとボトムバーナビゲーション
 * TODO: ヘッダーのアイコンとテキストのjustifyContentをcenterにしたい
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          headerTitle: Description.appName,
          headerTitleAlign: "left",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerLeft: () => <LogoIcon style={{ marginLeft: 15 }} />,
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "成績",
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="line-chart" color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="share"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "セッション一覧",
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "設定",
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
