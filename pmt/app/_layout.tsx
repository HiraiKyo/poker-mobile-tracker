import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { Database } from "../libs/sqlite";
import { AppError } from "../libs/error";
import { DataProvider } from "../context/dataContext";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export let database: Database;
// FIXME: エラー管理クラスの利用方法、Cycled Dependency解消
// export const appError: AppError = AppError.getInstance();

export default function RootLayout() {
  /**
   * === アプリ起動直後の読込処理 start ===
   */
  const colorScheme = useColorScheme();

  // フォント読込処理
  const [fontLoaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  // エラー画面表示のためのRethrow
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // DB読込処理
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);
  // DBロード
  Database.getInstance()
    .then((_) => {
      database = _;
      setDbLoaded(true);
    })
    .catch((e) => setDbLoaded(false));

  // アプリ起動完了後、スプラッシュから画面遷移
  useEffect(() => {
    if (fontLoaded && dbLoaded) {
      // 起動時読込が増えたらここ
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, dbLoaded]); // 起動時読込が増えたらここ

  if (!fontLoaded || !dbLoaded) {
    // 起動時読込が増えたらここ
    return null;
  }

  /**
   * === アプリ起動直後の読込処理 end ===
   */

  return (
    <ApplicationProvider
      {...eva}
      theme={colorScheme === "dark" ? eva.dark : eva.light}
    >
      <DataProvider>
        <RootLayoutNav />
      </DataProvider>
    </ApplicationProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="session_add"
          options={{
            headerTitleAlign: "center",
            headerBackTitle: "セッション一覧",
            title: "セッションを記録",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="setting"
          options={{
            headerTitleAlign: "center",
            headerBackTitle: "設定",
            title: "設定",
            presentation: "modal",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
