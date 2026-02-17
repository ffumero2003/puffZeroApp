import { ActivityIndicator, View } from "react-native";

export default function Splash() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#E5E0FF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#E5E0FF" />
    </View>
  );
}
