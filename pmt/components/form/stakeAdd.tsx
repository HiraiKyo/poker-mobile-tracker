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
import { Session, SessionWithStake, sessionSchema } from "../../types/session";
import Colors from "../../constants/Colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { database } from "../../app/_layout";
import { Stake, stakeSchema } from "../../types/stake";
import { IndexPath, Select } from "@ui-kitten/components";
import { useState } from "react";
import { useData } from "../../context/dataContext";

/** フォーム型宣言 ここで宣言したパラメータで入力エリアを作成する */
type FormParams = Omit<
  SessionWithStake,
  "id" | "stakes_code" | "created_at" | "updated_at" | "deleted_at"
>;

/**
 * 新規ステークスとともにセッション記録
 */
export default ({
  setStakesCode,
}: {
  setStakesCode: (stakes_code: number) => void;
}) => {
  const colorScheme = useColorScheme();

  const defaultValues: FormParams = {
    stakes_name: "デフォルト",
    sb: 1,
    bb: 2,
    provider: "デフォルトサイト",
    session_at: Date.now().toLocaleString(),
    hands_amount: 0,
    win_amount: 0,
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
  const onSubmitHandler = async (data: FormParams) => {
    console.log("Submit button has been pressed.");
    await new Promise((resolve, reject) => {
      // 1. TODO: DB登録、完了と同時にフォームクリアと送信ボタンをenabled
      // 1-e. TODO: DB登録失敗時はフォームクリアしない

      // ステークスを追加、成功したらセッション追加処理に移行
      database.insertStake(
        data,
        (insertedData: Stake) => {
          database.insertSession(
            { ...data, stakes_code: insertedData.stakes_code },
            () => resolve,
            () => reject
          );
        },
        () => reject
      );
    });
  };

  /** 失敗時処理 */
  const onSubmitErrorHandler = (e: any) => {
    console.error(e);
  };

  // フォームクリア
  const clearForm = () => {};

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

/**
 * インプット個別コンポーネント化
 */
/** Props */
type Props = {
  register: UseFormRegister<FormParams>;
  control: Control<FormParams, any>;
  errors: FieldErrors<FormParams>;
};

const Stakes_name = ({ register, control, errors }: Props) => {
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

const Bb = ({ register, control, errors }: Props) => {
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

const Sb = ({ register, control, errors }: Props) => {
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

const Provider = ({ register, control, errors }: Props) => {
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
