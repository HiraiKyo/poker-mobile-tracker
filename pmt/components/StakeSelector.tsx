import { Dispatch, SetStateAction } from "react";
import { Dimensions, useColorScheme, StyleSheet } from "react-native";
import Picker from "react-native-picker-select";
import { Colors } from "react-native/Libraries/NewAppScreen";

export const StakeSelector = ({
  val,
  setter,
}: {
  val: string;
  setter: Dispatch<SetStateAction<string>>;
}) => {
  const colorScheme = useColorScheme();

  return (
    <>
      {/** FIXME: pickerがDark mode? Mobile? だと表示されない styleも反映されてなさそう */}
      <Picker
        value={val}
        onValueChange={(itemValue) => setter(itemValue)}
        items={stakes}
        style={pickerSelectStyles}
        placeholder={{ label: "ステークスを選択", value: "all" }}
        useNativeAndroidPickerStyle={false}
      />
    </>
  );
};

const stakes = [
  {
    label: "ALL",
    value: "all",
    color: "#f00",
    key: "all",
    style: { color: "#000", fontSize: 20 },
  },
  {
    label: "KKPoker NLH $100-$500 Flash",
    value: "kkpoker-nlh-100-500-flash",
    color: "#f00",
    key: "kkpoker-nlh-100-500-flash",
    style: { color: "#000", fontSize: 20 },
  },
];

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 28,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#789",
    borderRadius: 4,
    color: "#789",
    width: Dimensions.get("window").width - 2 * 40,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  inputAndroid: {
    fontSize: 28,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: "#789",
    borderRadius: 8,
    color: "#000",
    width: Dimensions.get("window").width - 2 * 40,
    backgroundColor: "#ffffff",
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
});
