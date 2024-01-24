import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";
import { View, Text } from "../Themed";
import { Session, sessionSchema } from "../../types/session";
import Colors from "../../constants/Colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { database } from "../../app/_layout";
import { Stake } from "../../types/stake";

/** フォーム型宣言 ここで宣言したパラメータで入力エリアを作成する */
type FormParams = Omit<
  Session,
  "id" | "stakes_code" | "created_at" | "updated_at" | "deleted_at"
>;
/**
 * 既存ステークスへのセッション追加フォーム
 */
export default ({ stake }: { stake: Stake }) => {
  const colorScheme = useColorScheme();

  const defaultValues: FormParams = {
    session_at: "",
    win_amount: 0,
    hands_amount: 0,
  };

  const {
    control,
    register,
    watch,
    handleSubmit,
    setValue,
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

  /** 成功時処理 */
  const onSubmitHandler = (data: FormParams) => {
    new Promise((resolve, reject) => {
      // 1. DB登録、完了と同時にフォームクリアと送信ボタンをenabled
      // 1-e. DB登録失敗時はフォームクリアしない
      database.insertSession(
        { ...data, stakes_code: stake.stakes_code },
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
    <>
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
            セッションを追加
          </Text>
        )}
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  line: {
    flexDirection: "row",
    alignItems: "center",
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

/**
 * セッション追加用個別フォーム
 */
type Props = {
  register: UseFormRegister<FormParams>;

  control: Control<FormParams, any>;
  errors: FieldErrors<FormParams>;
};

const Session_at = ({ register, control, errors }: Props) => {
  const colorScheme = useColorScheme();
  const key = "session_at";

  return (
    <>
      <View style={{ flex: 0.4, alignItems: "flex-end" }}>
        <Text
          style={{
            fontSize: 24,
            color: Colors[colorScheme ?? "light"].text,
            textAlign: "right",
          }}
        >
          セッション{"\n"}終了時間
        </Text>
      </View>
      <View style={{ flex: 0.6 }}>
        <Controller
          control={control}
          name={key}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                flex: 1,
                width: "80%",
                fontSize: 24,
                marginLeft: "4%",
                marginVertical: "2%",
                color: Colors[colorScheme ?? "light"].text,
              }}
              placeholder="10000"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
        />
        {/** バリデーションエラー表示 */}
        {errors[key] && errors[key].type === "required" && (
          <Text style={{ color: "red" }}>日付は必須です。</Text>
        )}
        {errors[key] && errors[key].type === "maxLength" && (
          <Text style={{ color: "red" }}>
            日付は10桁以内で入力してください。
          </Text>
        )}
      </View>
    </>
  );
};

const Win_amount = ({ register, control, errors }: Props) => {
  const colorScheme = useColorScheme();
  const key = "win_amount";

  return (
    <>
      <View style={{ flex: 0.4, alignItems: "flex-end" }}>
        <Text
          style={{
            fontSize: 24,
            color: Colors[colorScheme ?? "light"].text,
            textAlign: "right",
          }}
        >
          勝ち額
        </Text>
      </View>
      <View style={{ flex: 0.6 }}>
        <Controller
          control={control}
          name={key}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                flex: 1,
                width: "80%",
                fontSize: 24,
                marginLeft: "4%",
                marginVertical: "2%",
                color: Colors[colorScheme ?? "light"].text,
              }}
              keyboardType="numeric"
              placeholder="10000"
              {...register(key, { valueAsNumber: true })} // バリデーション前数値変換
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value.toString()}
            />
          )}
        />
        {/** バリデーションエラー表示 */}
        {errors[key] && errors[key].type === "required" && (
          <Text style={{ color: "red" }}>日付は必須です。</Text>
        )}
        {errors[key] && errors[key].type === "maxLength" && (
          <Text style={{ color: "red" }}>
            勝ち額は10桁以内で入力してください。
          </Text>
        )}
      </View>
    </>
  );
};

const Hands_amount = ({ register, control, errors }: Props) => {
  const colorScheme = useColorScheme();
  const key = "hands_amount";

  return (
    <>
      <View style={{ flex: 0.4, alignItems: "flex-end" }}>
        <Text
          style={{
            fontSize: 24,
            color: Colors[colorScheme ?? "light"].text,
            textAlign: "right",
          }}
        >
          ハンド数
        </Text>
      </View>
      <View style={{ flex: 0.6 }}>
        <Controller
          control={control}
          name={key}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                flex: 1,
                width: "80%",
                fontSize: 24,
                marginLeft: "4%",
                marginVertical: "2%",
                color: Colors[colorScheme ?? "light"].text,
              }}
              keyboardType="numeric"
              {...register(key, { valueAsNumber: true })} // バリデーション前数値変換
              onBlur={onBlur}
              placeholder="500"
              onChangeText={(value) => onChange(value)}
              value={value.toString()}
            />
          )}
        />
        {/** バリデーションエラー表示 */}
        {errors[key] && errors[key].type === "required" && (
          <Text style={{ color: "red" }}>日付は必須です。</Text>
        )}
        {errors[key] && errors[key].type === "maxLength" && (
          <Text style={{ color: "red" }}>
            勝ち額は10桁以内で入力してください。
          </Text>
        )}
      </View>
    </>
  );
};
