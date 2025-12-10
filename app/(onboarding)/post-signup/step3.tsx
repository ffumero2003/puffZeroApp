import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Step3() {
  return (
    <View>
      <Text>STEP 3 (dummy)</Text>
      <Button title="Next" onPress={() => router.push("/(onboarding)/post-signup/step4")} />
    </View>
  );
}
