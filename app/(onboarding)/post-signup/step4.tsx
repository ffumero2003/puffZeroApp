import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Step4() {
  return (
    <View>
      <Text>STEP 4 (dummy)</Text>
      <Button title="Next" onPress={() => router.push("/(app)/paywall")} />
    </View>
  );
}
