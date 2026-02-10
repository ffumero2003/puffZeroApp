import Logo from "@/assets/images/logo-puff-zero.png";
import { useThemeColors } from "@/src/providers/theme-provider";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function Splash() {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Image source={Logo} style={{ width: 200, height: 200 }} />

        <Text
          style={{
            marginTop: 20,
            fontSize: 30,
            color: colors.text,
            fontWeight: "700",
            textAlign: "center",
            lineHeight: 35,
            paddingHorizontal: 80,
          }}
        >
          Consigue tu mejor versión
        </Text>
      </View>

      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={{ marginTop: 40 }}
      />

      <Text
        style={{
          position: "absolute",
          bottom: 30,
          color: colors.textSecondary,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        PuffZero — Para de fumar
      </Text>
    </View>
  );
}
