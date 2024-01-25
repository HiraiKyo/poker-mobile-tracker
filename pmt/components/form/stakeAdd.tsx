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
import { Stake, stakeSchema } from "../../types/stake";
import Stakes_name from "./stake/stakes_name";
import Provider from "./stake/provider";
import Bb from "./stake/bb";
import Sb from "./stake/sb";

/**
 * ステークス追加フォーム
 */
export default ({ setStakesCode }: { setStakesCode : (stakes_code: number) => void }) => {
  const colorScheme = useColorScheme();

  /** フォーム型宣言 ここで宣言したパラメータで入力エリアを作成する */
  type FormParams = Omit<
    Stake,
    "stakes_code" | "created_at" | "updated_at" | "deleted_at"
  >;
  const defaultValues: FormParams = {
    stakes_name: "デフォルト",
    sb: 1,
    bb: 2,
    provider: "デフォルトサイト",
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormParams>({
    defaultValues,
    resolver: zodResolver(
      stakeSchema.omit({
        stakes_code: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      })
    ), // Zodにてバリデーションルール定義
  });

  /** 成功時処理 */
  const onSubmitHandler = (data: FormParams) => {
    console.log("Submit button has been pressed.");
    new Promise((resolve, reject) => {
      // 1. DB登録、完了と同時にフォームクリアと送信ボタンをenabled
      // 1-e. DB登録失敗時はフォームクリアしない
      database.insertStake(
        data,
        (resultSet) => {
          if(resultSet.insertId){
            setStakesCode(resultSet.insertId)
            clearForm();
          }
        },
        (e) => {
          console.error(e.message)
        }
      );
    });
  };

  /** 失敗時処理 */
  const onSubmitErrorHandler = (e: any) => {
    console.error(e);
  };

  // フォームクリア
  const clearForm = () => {

  }

  return (
    <View style={styles.container}>
      {/** ステークス */}
      <View style={styles.line}>
        <Stakes_name register={register} control={control} errors={errors} />
      </View>

      {/** SB */}
      <View style={styles.line}>
        <Sb register={register} control={control} errors={errors} />
      </View>

      {/** BB */}
      <View style={styles.line}>
        <Bb register={register} control={control} errors={errors} />
      </View>

      {/** サイト */}
      <View style={styles.line}>
        <Provider register={register} control={control} errors={errors} />
      </View>

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
            ステークスを追加
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
