import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
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
  secureTextEntry,
  style,
  ...props
}: UnderlineInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry === true;

  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.light.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        style={styles.input}
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
