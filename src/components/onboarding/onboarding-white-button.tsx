import { TouchableOpacity } from "react-native";
import { components } from "../../../src/styles/components";
import AppText from "../app-text";

export default function OnboardingWhiteButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={components.buttonWhite} activeOpacity={0.85} onPress={onPress}>
      <AppText weight="semibold" style={components.textWhite}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
}
 

