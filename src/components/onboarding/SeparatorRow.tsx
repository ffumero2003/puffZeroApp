import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { StyleSheet, View } from "react-native";

export default function SeparatorRow(){
  const colors = useThemeColors();

  return(
    <View style={styles.separatorRow}>
              <View style={[styles.separatorLine, { backgroundColor: colors.text }]} />
              <AppText style={[styles.separatorText, { color: colors.text }]}>o</AppText>
              <View style={[styles.separatorLine, { backgroundColor: colors.text }]} />
            </View>
  )
}

const styles = StyleSheet.create({
  separatorRow: {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 14,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    opacity: 0.6,
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 20,
  },
 })


