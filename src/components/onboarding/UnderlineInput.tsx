import { Colors } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface UnderlineInputProps extends TextInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
  fieldType: "name" | "email" | "password" | "confirmPassword";

}

function capitalizeWords(text: string) {
      return text
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
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

  const isPassword =
  fieldType === "password" || fieldType === "confirmPassword";

  const textContentTypeMap = {
    name: "name",
    email: "emailAddress",
    password: "newPassword",
    confirmPassword: "newPassword",
  } as const;

  const autoCompleteMap = {
    name: "name",
    email: "email",
    password: "password-new",
    confirmPassword: "password-new",
  } as const;

  



  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.light.textMuted}
        value={value}
        onChangeText={(text) => {
          if (fieldType === "name") {
            onChangeText?.(capitalizeWords(text));
          } else {
            onChangeText?.(text);
          }
        }}
        secureTextEntry={isPassword && !showPassword}
        style={styles.input}
        textContentType={textContentTypeMap[fieldType]}
        autoComplete={autoCompleteMap[fieldType]}
        autoCapitalize={fieldType === "name" ? "words" : "none"}
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
            color={Colors.light.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    borderBottomWidth: 10,
    borderBottomColor: "#E5E0FF",
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
