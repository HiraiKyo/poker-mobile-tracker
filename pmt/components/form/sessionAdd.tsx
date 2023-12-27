import { useForm } from "react-hook-form";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { View, Text } from "../Themed";
import Session_at from "./session/session_at";
import { Session, sessionSchema } from "../../types/session";
import Win_amount from "./session/win_amount";
import Colors from "../../constants/Colors";
import { zodResolver } from "@hookform/resolvers/zod";
import Hands_amount from "./session/hands_amount";
import Stakes_code from "./session/stakes_code";
import { database } from "../../app/_layout";
import StakeAdd from "./stakeAdd";
import { useEffect, useState } from "react";

/**
 * セッション追加フォーム
 */
export default () => {
  const colorScheme = useColorScheme();

  /** フォーム型宣言 ここで宣言したパラメータで入力エリアを作成する */
  type FormParams = Omit<
    Session,
    "id" | "created_at" | "updated_at" | "deleted_at"
  >;
  const defaultValues: FormParams = {
    session_at: "",
    win_amount: 0,
    hands_amount: 0,
    stakes_code: -1, //FKey デフォルト-1で、-1の場合は新規ステークス作成
  };

  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: zodResolver(
      sessionSchema.omit({
        id: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      })
    ), // Zodにてバリデーションルール定義
  });

  /**
   * セレクタで、ステークスを新規作成するか既存ステークスを選択するかを監視する。
   * 新規ステークスフォームの表示と、Submitの処理分岐のため
   */
  const stakes_code = watch("stakes_code");
  const [isNewStake, setNewStake] = useState<boolean>(false);
  useEffect(() => {
    if (stakes_code === -1) {
      setNewStake(true);
    } else {
      setNewStake(false);
    }
    console.log(stakes_code);
  }, [stakes_code]);

  /** 成功時処理 */
  const onSubmitHandler = (data: FormParams) => {
    console.log("Submit button has been pressed.");
    new Promise((resolve, reject) => {
      // 1. DB登録、完了と同時にフォームクリアと送信ボタンをenabled
      // 1-e. DB登録失敗時はフォームクリアしない
      database.insertSession(
        data,
        () => resolve,
        () => reject
      );
    });
  };

  /** 失敗時処理 */
  const onSubmitErrorHandler = (e: any) => {
    console.error(e);
  };

  return (
    <View style={styles.container}>
      {/** セッション終了時刻 */}
      <View style={styles.line}>
        <Session_at register={register} control={control} errors={errors} />
      </View>

      {/** 勝ち額 */}
      <View style={styles.line}>
        <Win_amount register={register} control={control} errors={errors} />
      </View>

      {/** ハンド数 */}
      <View style={styles.line}>
        <Hands_amount register={register} control={control} errors={errors} />
      </View>

      {/** ステークスコード TODO: ステークスの新規登録フォームと連結する */}
      <View style={styles.line}>
        <Stakes_code register={register} control={control} errors={errors} />
      </View>

      {isNewStake && <StakeAdd />}

      <Pressable
        onPress={handleSubmit(onSubmitHandler, onSubmitErrorHandler)}
        disabled={isSubmitting}
      >
        {({ pressed }) => (
          <Text
            style={[
              styles.button,
              {
                color: Colors[colorScheme ?? "light"].text,
                backgroundColor: isSubmitting
                  ? "#666"
                  : pressed
                  ? "#666"
                  : Colors[colorScheme ?? "light"].mainBg,
              },
            ]}
          >
            新規追加
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    fontSize: 32,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
