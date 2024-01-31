import { IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { Dispatch, SetStateAction, useState } from "react";
import { Dimensions, useColorScheme, StyleSheet } from "react-native";
import Picker from "react-native-picker-select";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Stake } from "../types/stake";
import { useData } from "../context/dataContext";
import { database } from "../app/_layout";
import { stakeCombinedName } from "../libs/label";

export const STAKES_CODE_ALL = -1; // 全件取得コードは-1に暗黙的に指定
export const DEFAULT_STAKE: Stake = {
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
  deleted_at: null,
  stakes_code: STAKES_CODE_ALL,
  stakes_name: "総計",
  sb: 1,
  bb: 2,
  provider: "default",
};

export const StakeSelector = ({
  setter,
}: {
  setter: Dispatch<SetStateAction<Stake>>;
}) => {
  const colorScheme = useColorScheme();
  const defaultIndex = 0; // TODO: キャッシュされた最後の値をデフォルトにする FIXME: 配列順序は毎回同じ？配列内検索してインデックス番号を取得する必要あり

  const { stakes } = useData();

  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(defaultIndex)
  );

  const setterWrapper = (i: IndexPath | IndexPath[]) => {
    const indexPath = Array.isArray(i) ? i[0] : i;

    if (indexPath) {
      setSelectedIndex(indexPath);
      setter([DEFAULT_STAKE, ...stakes][indexPath.row]);
    }
  };
  const displayValue = stakeCombinedName({
    stake: [DEFAULT_STAKE, ...stakes][selectedIndex.row],
  });

  return (
    <Select
      placeholder={"ステークスを選択"}
      style={styles.select}
      multiSelect={false}
      value={displayValue}
      selectedIndex={selectedIndex}
      onSelect={setterWrapper}
    >
      {[DEFAULT_STAKE, ...stakes].map((stake, index) => (
        <SelectItem
          key={index}
          title={stakeCombinedName({ stake })}
          style={styles.selectItem}
        />
      ))}
    </Select>
  );
};

const styles = StyleSheet.create({
  select: {
    flex: 1,
    margin: 2,
  },
  selectItem: {
    flex: 1,
  },
});
