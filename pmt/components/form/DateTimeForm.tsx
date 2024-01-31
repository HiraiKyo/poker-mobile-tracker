import { Control, Controller } from "react-hook-form";
import DateTimePicker, {
  ButtonType,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

type Props = {
  isVisible: boolean;
  control: Control<any, any>;
  name: string;
  onClose: () => void;
};

/**
 * DateTimePickerを利用する
 * Androidはmode="datetime"が利用できないので、date -> timeの順で行った後にonClose処理を実行する
 */
export default ({ isVisible, control, name, onClose }: Props) => {
  const [mode, setMode] = useState<"date" | "time" | null>(null);
  useEffect(() => {
    if (isVisible && mode === null) {
      setMode(mode === "time" ? "time" : "date");
    } else if (!isVisible) {
      setMode(null);
    }
  }, [isVisible, mode]);

  if (!isVisible || !mode) return null;

  const onChangeHandler = (e: DateTimePickerEvent, date: Date | undefined) => {
    if (e.type === "dismissed") {
      // onClose(); // FIXME: 挙動おかしい、dismissがやたらトリガーされる
      return;
    }
    if (mode === "date") {
      setMode("time");
      return;
    }
    onClose();
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={new Date(Date.now())}
      render={({ field: { onChange, value } }) => {
        if (Platform.OS === "ios") {
          return (
            <DateTimePicker
              display="inline"
              value={value || new Date(Date.now())} // Provide a default value if value is empty
              mode="datetime"
              onChange={(e, date) => {
                onChange(date ?? new Date(Date.now()));
                if (e.type === "set" || e.type === "dismissed") {
                  onClose();
                }
              }}
            />
          );
        } else {
          return (
            <DateTimePicker
              value={value || new Date(Date.now())} // Provide a default value if value is empty
              mode={mode}
              display="default"
              onChange={(e, date) => {
                onChange(date ?? new Date(Date.now()));
                onChangeHandler(e, date);
              }}
            />
          );
        }
      }}
    />
  );
};
