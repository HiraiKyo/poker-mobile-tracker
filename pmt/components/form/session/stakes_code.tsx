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
import { IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { useData } from "../../../context/dataContext";
import { useState } from "react";

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
  const key = "stakes_code";
  const { stakes } = useData();

  // セレクタの表示管理
  /**
   * セレクタの0番目を新規レコード追加にしているため、各所で1インデックスずらす処理が入っている
   * セレクタの0番目を選択して新規レコードを追加する場合には、ステークス情報を送信 -> 新規ステークスを取得 -> 新規ステークスのstakes_codeをsessionデータに入れて突っ込んでいる
   * その場合、このセレクタの格納値は-1になる。(stakes_codeはインクリメントされる正の整数なため、負数の場合は新規ステークスという暗黙の設定)
   * FIXME: ここにロジック書きたくない
   **/
  const defaultIndex = 0; // TODO: キャッシュされた最後の値をデフォルトにする FIXME: 配列順序は毎回同じ？配列内検索してインデックス番号を取得する必要あり
  const defaultValue = -1; // TODO: キャッシュされた最後の値をデフォルトにする
  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(defaultIndex)
  );
  const [multiSelectedIndex, setMultiSelectedIndex] = useState<IndexPath[]>([
    new IndexPath(defaultIndex),
  ]);

  /** セレクタの表示名をここで編集する、sb/bbとか */
  const genDisplayValue = (index: number) => {
    if (index === 0) return "新しいステークスを追加";
    return stakes[index - 1].stakes_name;
  };

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
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              style={{ marginRight: 10 }}
              multiSelect={false}
              accessibilityLabel={"ステークス"}
              onSelect={(index) => {
                if (Array.isArray(index)) {
                  if (index[0].row === 0) {
                    onChange(-1);
                  } else {
                    onChange(stakes[index[0].row - 1].stakes_code);
                  }
                  setMultiSelectedIndex(index);
                } else {
                  if (index.row === 0) {
                    onChange(-1);
                  } else {
                    onChange(stakes[index.row - 1].stakes_code);
                  }
                  setSelectedIndex(index);
                }
              }}
              onBlur={onBlur}
            >
              <>
                <SelectItem
                  key={`select-option-new`}
                  title={genDisplayValue(0)}
                />

                {stakes.map((stake, i) => (
                  <SelectItem
                    key={`select-option-${stake.stakes_code}`}
                    title={genDisplayValue(i + 1)}
                  />
                ))}
              </>
            </Select>
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
