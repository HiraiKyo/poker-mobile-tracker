import React, { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  useColorScheme,
} from "react-native";
import { Button, Divider, Toggle } from "@ui-kitten/components";

import { Text, View } from "../Themed";
import { boolean } from "zod";
import { SimpleLineIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

interface SectionProps extends TouchableOpacityProps {
  title: string;
  line: SettingLine;
  children?: React.ReactNode;
}

type SettingLine = {
  type: "button" | "toggle";
  action: () => Promise<void>;
  toggleValue?: boolean;
  buttonLabel?: string;
  status: ButtonStatus;
  description: string;
};

type ButtonStatus =
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "basic"
  | "control";

export const Setting = (
  props: SectionProps
): React.ReactElement<TouchableOpacityProps> => {
  const { style, title, line, children, ...touchableOpacityProps } = props;
  const colorScheme = useColorScheme();

  return (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={1.0}
        {...touchableOpacityProps}
        style={[styles.container, style]}
      >
        <Text style={styles.title}>{title}</Text>
        {line.type === "button" && (
          <Button
            style={[styles.button]}
            status={line.status}
            appearance="outline"
            onPress={line.action}
          >
            {line.buttonLabel ?? "実行"}
          </Button>
        )}
        {line.type === "toggle" && (
          <Toggle
            style={[
              styles.toggle,
              { outlineColor: Colors[colorScheme ?? "light"].tint },
            ]}
            checked={line.toggleValue ?? false}
            onChange={line.action}
          />
        )}
      </TouchableOpacity>
      <Text style={styles.description}>{line.description}</Text>
      <Divider />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
  },
  button: {},
  toggle: {},
  description: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
});
