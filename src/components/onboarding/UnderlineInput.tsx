import { useThemeColors } from "@/src/providers/theme-provider";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface UnderlineInputProps extends TextInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
  fieldType: "name" | "email" | "password" | "confirmPassword";
}

function capitalizeWords(text: string) {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function UnderlineInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  style,
  fieldType,
  ...props
}: UnderlineInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const colors = useThemeColors();

  const isPassword =
    fieldType === "password" || fieldType === "confirmPassword";

  const textContentTypeMap = {
    name: "name",
    email: "emailAddress",
    password: "none",
    confirmPassword: "none",
  } as const;

  const autoCompleteMap = {
    name: "name",
    email: "email",
    password: "off",
    confirmPassword: "off",
  } as const;

  const keyboardTypeMap = {
    name: "default",
    email: "email-address",
    password: "default",
    confirmPassword: "default",
  } as const;

  return (
    <View
      style={[styles.wrapper, { borderBottomColor: colors.secondary }, style]}
    >
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={(text) => {
          if (fieldType === "name") {
            onChangeText?.(capitalizeWords(text));
          } else {
            onChangeText?.(text);
          }
        }}
        secureTextEntry={isPassword && !showPassword}
        style={[styles.input, { color: colors.text }]}
        textContentType={textContentTypeMap[fieldType]}
        autoComplete={autoCompleteMap[fieldType]}
        autoCapitalize={fieldType === "name" ? "words" : "none"}
        keyboardType={keyboardTypeMap[fieldType]}
        {...props}
      />

      {/* 👁️ Ojo SOLO si es contraseña */}
      {isPassword && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    borderBottomWidth: 10,

    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingLeft: 4,
    paddingVertical: 8,
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
  },
  iconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
