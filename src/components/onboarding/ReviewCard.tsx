import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";


interface ReviewCardProps {
  name: string;
  age: number;
  text: string;
  image: ImageSourcePropType; 
}

export default function ReviewCard({ name, age, text, image }: ReviewCardProps) {
  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <Image source={image} style={styles.profileImage} />

        <View style={styles.headerText}>
          <AppText weight="bold" style={styles.name}>
            {name}, {age}
          </AppText>
          <AppText style={styles.stars}>⭐⭐⭐⭐⭐</AppText>
        </View>
      </View>

      {/* Review text */}
      <AppText style={styles.reviewText}>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D9D9F3",
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
    borderColor: "#000",
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
    color: Colors.light.primary,
  },

  reviewText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.light.text,
  },
});
