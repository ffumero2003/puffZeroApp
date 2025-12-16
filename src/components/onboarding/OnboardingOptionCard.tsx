import AppText from "@/src/components/AppText";
import { components } from "@/src/styles/components";
import { TouchableOpacity, View } from "react-native";

interface Props {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function OnboardingOptionCard({
  title,
  description,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[components.card, selected && components.cardSelected]}
    >
      <View style={[components.badge, selected && components.badgeSelected]}>
        <AppText weight="extrabold" style={components.badgeText}>
          {title} 
        </AppText>
      </View>

      <AppText weight="medium" style={components.description}>
        {description}
      </AppText>
    </TouchableOpacity>
  );
}


