import { Control, Controller, FieldErrors, FormState } from "react-hook-form";
import { z } from "zod";
import { Session } from "../../../types/session";
import { View, Text } from "../../Themed";
import Colors from "../../../constants/Colors";
import { TextInput, useColorScheme } from "react-native";

type Props = {
  control: Control<
    Omit<Session, "id" | "created_at" | "updated_at" | "deleted_at">,
    any
  >;
  errors: FieldErrors<
    Omit<Session, "id" | "created_at" | "updated_at" | "deleted_at">
  >;
};

export default ({ control, errors }: Props) => {
  const colorScheme = useColorScheme();
  const key = "stakes_code";

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
          サイト{"\n"}ステークス
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
              onChangeText={(value) => onChange(parseInt(value))}
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
