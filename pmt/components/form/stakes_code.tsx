import {
  Control,
  Controller,
  FieldErrors,
  FormState,
  UseFormRegister,
} from "react-hook-form";
import { z } from "zod";
import { Session } from "../../types/session";
import { View, Text } from "../Themed";
import Colors from "../../constants/Colors";
import { TextInput, useColorScheme } from "react-native";
import { IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { useData } from "../../context/dataContext";
import { useState } from "react";
import { Stake } from "../../types/stake";

type Props = {
  selectStake: (stake: Stake | undefined) => void;
};

export default ({ selectStake }: Props) => {
  const colorScheme = useColorScheme();
  const { stakes, reloadStakes } = useData();

  // セレクタの表示管理
  /**
   * セレクタの0番目を新規レコード追加にしているため、各所で1インデックスずらす処理が入っている
   * セレクタの0番目を選択して新規レコードを追加する場合には、ステークス情報を送信 -> 新規ステークスを取得 -> 新規ステークスのstakes_codeをsessionデータに入れて突っ込んでいる
   * その場合、このセレクタの格納値は-1になる。(stakes_codeはインクリメントされる正の整数なため、負数の場合は新規ステークスという暗黙の設定)
   **/
  const defaultIndex = 0; // TODO: キャッシュされた最後の値をデフォルトにする FIXME: 配列順序は毎回同じ？配列内検索してインデックス番号を取得する必要あり
  const defaultValue = -1; // TODO: キャッシュされた最後の値をデフォルトにする
  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(defaultIndex)
  );

  /**
   * セレクタ選択時処理
   */
  const selectIndex = (indexPath: IndexPath | IndexPath[]) => {
    const i = Array.isArray(indexPath) ? indexPath[0].row : indexPath.row;
    if (i === 0) {
      selectStake(undefined);
    }
    selectStake(stakes[i - 1]);
  };

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
          }}
        >
          サイト{"\n"}ステークス
        </Text>
      </View>
      <View style={{ flex: 0.6 }}>
        <Select
          multiSelect={false}
          accessibilityLabel={"ステークス"}
          onSelect={(indexPath) => {
            selectIndex(indexPath);
          }}
        >
          <>
            <SelectItem key={`select-option-new`} title={genDisplayValue(0)} />

            {stakes.map((stake, i) => (
              <SelectItem
                key={`select-option-${stake.stakes_code}`}
                title={genDisplayValue(i + 1)}
              />
            ))}
          </>
        </Select>
      </View>
    </>
  );
};
