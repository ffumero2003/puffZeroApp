import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string; // ✅ opcional
  price: string;
  strikePrice?: boolean; // 👈 NUEVO
  badge?: string;
  highlight?: string;
  selected?: boolean;
  onPress: () => void;
};

export default function SubscriptionOption({
  title,
  subtitle,
  price,
  strikePrice,
  badge,
  highlight,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, selected && styles.selected]}
    >
      {highlight && (
        <View style={[styles.highlight, selected && styles.selectedHighlight]}>
          <AppText weight="bold">
            {highlight}
          </AppText>
        </View>
      )}

      <View style={styles.mainRow}>
        {/* LEFT */}
        <View style={styles.textBlock}>
          <AppText weight="bold" style={styles.title} numberOfLines={1}>
            {title}
          </AppText>

          {subtitle && (
            <AppText
              style={styles.subtitle}
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          )}
        </View>

        {/* BADGE */}
        {badge && (
          <View style={styles.badge}>
            <AppText weight="bold" style={styles.badgeText}>
              {badge}
            </AppText>
          </View>
        )}

        <View style={styles.priceColumn}>
          <AppText
            weight="bold"
            style={[
              styles.priceValue,
              strikePrice && styles.striked,
            ]}
          >
            {price}
          </AppText>

          <AppText
            style={[
              styles.pricePeriod,
              strikePrice && styles.striked,
            ]}
          >
            semana
          </AppText>
        </View>


      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 18,
    padding: 22,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",

  },

  selected: {
    borderColor: Colors.light.primary,
  },

  highlight: {
    position: "absolute",
    top: -14,
    right: 12,
    backgroundColor: Colors.light.secondary,
    borderColor: Colors.light.border,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },

  selectedHighlight: {
    borderColor: Colors.light.primary,
  },

  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  textBlock: {
    flex: 1,
    minWidth: 0, // 🔥 CLAVE en RN para evitar overflow
  },

  title: {
    fontSize: 18,
  },

  subtitle: {
    opacity: 0.7,
    fontSize: 13,
    marginTop: 2,
  },

  badge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 8,
    flexShrink: 0,
  },
  badgeText : {
    color: Colors.light.textWhite
  },

  priceColumn: {
    alignItems: "flex-end",
  },

  priceValue: {
    fontSize: 16,
    lineHeight: 20,
  },

  pricePeriod: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: -2,
  },

  striked: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },


});
