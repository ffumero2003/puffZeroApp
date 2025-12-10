import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Step2() {
  return (
    <View>
      <Text>STEP 2 (dummy)</Text>
      <Button title="Next" onPress={() => router.push("/(onboarding)/post-signup/step3")} />
    </View>
  );
}
