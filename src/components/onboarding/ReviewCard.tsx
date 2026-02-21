import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

interface ReviewCardProps {
  name: string;
  age: number;
  text: string;
  image: ImageSourcePropType;
}

export default function ReviewCard({
  name,
  age,
  text,
  image,
}: ReviewCardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.cardBorder },
      ]}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <Image
          source={image}
          style={[styles.profileImage, { borderColor: colors.cardBorder }]}
        />

        <View style={styles.headerText}>
          <AppText weight="bold" style={[styles.name, { color: colors.text }]}>
            {name}, {age}
          </AppText>
          <AppText style={styles.stars}>⭐⭐⭐⭐⭐</AppText>
        </View>
      </View>

      {/* Review text */}
      <AppText style={[styles.reviewText, { color: colors.text }]}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    marginBottom: 22,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  profileImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,

    marginRight: 14,
  },

  headerText: {
    flexDirection: "column",
    justifyContent: "center",
  },

  name: {
    fontSize: 17,
    marginBottom: 4,
  },

  stars: {
    fontSize: 18,
  },

  reviewText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
