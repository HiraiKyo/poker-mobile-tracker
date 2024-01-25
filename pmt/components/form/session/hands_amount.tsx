import {
  Control,
  Controller,
  FieldErrors,
  FormState,
  UseFormRegister,
} from "react-hook-form";
import { z } from "zod";
import { Session } from "../../../types/session";
import { View, Text } from "../../Themed";
import Colors from "../../../constants/Colors";
import { TextInput, useColorScheme } from "react-native";

type Props = {
  register: UseFormRegister<
    Omit<Session, "id" | "created_at" | "updated_at" | "deleted_at">
  >;

  control: Control<
    Omit<Session, "id" | "created_at" | "updated_at" | "deleted_at">,
    any
  >;
  errors: FieldErrors<
    Omit<Session, "id" | "created_at" | "updated_at" | "deleted_at">
  >;
};

export default ({ register, control, errors }: Props) => {
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
            marginLeft: 10,
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
                marginRight: 10,
                fontSize: 24                                                             ,
                marginLeft: 4,
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
