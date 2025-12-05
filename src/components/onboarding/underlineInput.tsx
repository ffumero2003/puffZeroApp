import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { Colors } from "../../constants/theme";

interface UnderlineInputProps extends TextInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
}

export default function UnderlineInput({
  placeholder,
  value,
  onChangeText,
  style,
  ...props
}: UnderlineInputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={Colors.light.textMuted}
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
    borderBottomWidth: 10,
    borderRadius: 12,
    borderBottomColor: "#E5E0FF", // lavanda del diseño
    paddingLeft: 4,
    paddingVertical: 8,
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
  },
});
