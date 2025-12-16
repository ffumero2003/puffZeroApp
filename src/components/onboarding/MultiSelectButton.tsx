import AppText from "@/src/components/AppText";
import { components } from "@/src/styles/components";
import { TouchableOpacity } from "react-native";

export default function MultiSelectButton({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[components.multiButton, selected && components.multiButtonSelected]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <AppText weight="semibold" style={[components.multiText, selected && components.multiTextSelected]}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
}
 
