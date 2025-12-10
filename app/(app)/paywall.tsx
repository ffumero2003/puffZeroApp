import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Paywall() {
  return (
    <View>
      <Text>PAYWALL (dummy)</Text>
      <Button title="Enter App" onPress={() => router.replace("/(app)/home")} />
    </View>
  );
}
