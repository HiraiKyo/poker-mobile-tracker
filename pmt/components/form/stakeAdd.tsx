import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { Pressable, StyleSheet, TextInput, useColorScheme } from "react-native";
import { View, Text } from "../Themed";
import { SessionWithStake, sessionWithStakeSchema } from "../../types/session";
import Colors from "../../constants/Colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { database } from "../../app/_layout";
import { Stake } from "../../types/stake";
import { ReactElement, useEffect, useState } from "react";
import { Button, Modal, Popover } from "@ui-kitten/components";
import DateTimeForm from "./DateTimeForm";

/** フォーム型宣言 ここで宣言したパラメータで入力エリアを作成する */
type FormParams = Omit<
  SessionWithStake,
  "id" | "stakes_code" | "created_at" | "updated_at" | "deleted_at"
>;

/**
 * 新規ステークスとともにセッション記録
 */
export default () => {
  const colorScheme = useColorScheme();

  const defaultValues: FormParams = {
    stakes_name: "デフォルト",
    sb: 1,
    bb: 2,
    provider: "デフォルトサイト",
    session_at: new Date(Date.now()),
    hands_amount: 0,
    win_amount: 0,
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormParams>({
    defaultValues,
    resolver: zodResolver(
      sessionWithStakeSchema.omit({
        id: true,
        stakes_code: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      })
    ), // Zodにてバリデーションルール定義
  });

  /** 成功時処理 */
  const onSubmitHandler = async (data: FormParams) => {
    console.log("Submit button has been pressed.");
    // TODO: ユーザビリティの都合上、ここにsleepを入れた方がいいかもしれない

    await new Promise((resolve, reject) => {
      // ステークスを追加、成功したらセッション追加処理に移行
      database.insertStake(
        data,
        (insertedData: Stake) => {
          database.insertSession(
            { ...data, stakes_code: insertedData.stakes_code },
            (sessions) => {
              // 入力成功したらフォームクリア、失敗ならクリアせず
              clearForm();
              // TODO: ユーザビリティ向上、フォーム入力成功ポップアップ
              resolve(sessions);
            },
            () => reject()
          );
        },
        () => reject()
      );
    });
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
    <View style={styles.container}>
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
      {/** ステークス */}
      <View style={styles.line}>
        <Stakes_name control={control} errors={errors} />
      </View>

      {/** SB */}
      <View style={styles.line}>
        <Sb control={control} errors={errors} />
      </View>

      {/** BB */}
      <View style={styles.line}>
        <Bb control={control} errors={errors} />
      </View>

      {/** サイト */}
      <View style={styles.line}>
        <Provider control={control} errors={errors} />
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

/**
 * インプット個別コンポーネント化
 */
/** Props */
type Props = {
  control: Control<FormParams, any>;
  errors: FieldErrors<FormParams>;
};

const Stakes_name = ({ control, errors }: Props) => {
  const colorScheme = useColorScheme();
  const key = "stakes_name";

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
          ステークス
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
              placeholder="ステークス名"
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
            勝ち額は10桁以内で入力してください。
          </Text>
        )}
      </View>
    </>
  );
};

const Bb = ({ control, errors }: Props) => {
  const colorScheme = useColorScheme();
  const key = "bb";

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
          Big Blind
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
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={(value) => onChange(Number(value))}
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

const Sb = ({ control, errors }: Props) => {
  const colorScheme = useColorScheme();
  const key = "sb";

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
          Small Blind
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
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={(value) => onChange(Number(value))}
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

const Provider = ({ control, errors }: Props) => {
  const colorScheme = useColorScheme();
  const key = "provider";

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
          サイト名
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
            勝ち額は10桁以内で入力してください。
          </Text>
        )}
      </View>
    </>
  );
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
              onChangeText={(value) => onChange(Number(value))}
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
