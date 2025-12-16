import { ActivityIndicator, Image, Text, View } from "react-native";
import Logo from "../../../assets/images/logo-puff-zero-circle.png";
import { Colors } from "../../constants/theme";

export default function Splash() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light.background,
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
            color: Colors.light.text,
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
        color={Colors.light.primary}
        style={{ marginTop: 40 }}
      />

      <Text
        style={{
          position: "absolute",
          bottom: 30,
          color: Colors.light.textSecondary,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        PuffZero — Para de fumar
      </Text>
    </View>
  );
}
