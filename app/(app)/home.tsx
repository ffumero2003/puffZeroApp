import { Text, TouchableOpacity, View } from "react-native";
import { devResetApp } from "../../src/config/dev-reset";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Pantalla Home (temporal)</Text>

      <TouchableOpacity
      onPress={devResetApp}
      style={{ marginTop: 40 }}
    >
      <Text>🔁 Reset app (DEV)</Text>
    </TouchableOpacity>
    </View>
  );
}
