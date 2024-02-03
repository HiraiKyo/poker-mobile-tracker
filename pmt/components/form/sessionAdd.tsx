import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import {
  Alert,
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
import { Popover } from "@ui-kitten/components";
import DateTimeForm from "./DateTimeForm";
import { ReactElement, useState } from "react";
import { useData } from "../../context/dataContext";

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
  const { reload, reloadStakes } = useData();

  const defaultValues: FormParams = {
    session_at: new Date(Date.now()),
    win_amount: 0,
    hands_amount: 0,
  };

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: zodResolver(
      sessionSchema.omit({
        id: true,
        stakes_code: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      })
    ), // Zodにてバリデーションルール定義、onChangeTextにて数値変換
  });

  /** 成功時処理 */
  const onSubmitHandler = (data: FormParams) => {
    new Promise((resolve, reject) => {
      // 1. DB登録、完了と同時にフォームクリアと送信ボタンをenabled
      // 1-e. DB登録失敗時はフォームクリアしない
      database.insertSession(
        { ...data, stakes_code: stake.stakes_code },
        (sessions) => {
          clearForm();
          resolve(sessions);
        },
        () => reject()
      );
    }).then(() => {
      Alert.alert("セッションを記録しました。");
      reload();
      reloadStakes();
    }
    ).catch(
      () => Alert.alert("セッションの記録に失敗しました。")
    );
  };

  /** 失敗時処理 */
  const onSubmitErrorHandler = (e: any) => {
    console.error(e);
  };

  // フォームクリア
  const clearForm = () => {
    reset();
  };

  /**
   * DateTimePickerの都合で、値をこっちから渡す必要がある
   */
  const sessionAt = watch("session_at");

  return (
    <>
      {/** セッション終了時刻 */}
      <View style={styles.line}>
        <Session_at value={sessionAt} control={control} errors={errors} />
      </View>

      {/** 勝ち額 */}
      <View style={styles.line}>
        <Win_amount control={control} errors={errors} />
      </View>

      {/** ハンド数 */}
      <View style={styles.line}>
        <Hands_amount control={control} errors={errors} />
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
 * インプット個別コンポーネント化
 */
/** Props */
type Props = {
  control: Control<FormParams, any>;
  errors: FieldErrors<FormParams>;
};

const Win_amount = ({ control, errors }: Props) => {
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
              onBlur={onBlur}
              onChangeText={(value) => onChange(toNumberWithMinus(value))}
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

const Session_at = ({ value, control, errors }: Props & { value: Date }) => {
  const colorScheme = useColorScheme();
  const key = "session_at";

  const [visible, setVisible] = useState<boolean>(false);

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
        <Pressable onPressIn={() => setVisible(true)}>
          {({ pressed }) => (
            <Text style={popoverStyles.display}>{value.toLocaleString()}</Text>
          )}
        </Pressable>

        <DateTimeForm
          isVisible={visible}
          control={control}
          name={key}
          onClose={() => setVisible(false)}
        />
      </View>
    </>
  );
};

const popoverStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  display: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flex: 1,
    width: "80%",
    fontSize: 24,
    marginLeft: "4%",
    marginVertical: "2%",
  },
});

const Hands_amount = ({ control, errors }: Props) => {
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
              onBlur={onBlur}
              placeholder="500"
              onChangeText={(v) => {
                onChange(Number(v));
              }}
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
