import { IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { Dispatch, SetStateAction } from "react";
import { Dimensions, useColorScheme, StyleSheet } from "react-native";
import Picker from "react-native-picker-select";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Stake } from "../types/stake";
import { useData } from "../context/dataContext";
import { database } from "../app/_layout";

export const StakeSelector = ({
  setter,
}: {
  setter: Dispatch<SetStateAction<Stake>>;
}) => {
  const colorScheme = useColorScheme();

  const { stakes } = useData();

  const setterWrapper = (i: IndexPath | IndexPath[]) => {
    const selectedIndex = Array.isArray(i) ? i[0]?.row : i.row;

    if (!selectedIndex) {
      setter(stakes[selectedIndex]);
    }
  };

  return (
    <Select
      placeholder={"ステークスを選択"}
      style={styles.select}
      multiSelect={false}
      onSelect={setterWrapper}
    >
      {stakes.map((stake, index) => (
        <SelectItem
          key={index}
          title={stake.stakes_name}
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
