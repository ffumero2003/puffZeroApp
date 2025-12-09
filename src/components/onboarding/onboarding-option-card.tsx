import { Colors } from "@/src/constants/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../app-text";

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
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={[styles.badge, selected && styles.badgeSelected]}>
        <AppText weight="extrabold" style={styles.badgeText}>
          {title}
        </AppText>
      </View>

      <AppText weight="medium" style={styles.description}>
        {description}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.secondaryBackground,
    borderWidth: 2,
    borderColor: "#C9D2FB",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardSelected: {
    backgroundColor: "#E5E0FF",
    borderColor: Colors.light.primary,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeSelected: {
    borderColor: Colors.light.primary,
  },
  badgeText: {
    fontSize: 16,
    color: Colors.light.textWhite,
  },
  description: {
    color: Colors.light.text,
    fontSize: 18,
  },
});
