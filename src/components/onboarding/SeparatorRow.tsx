import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { StyleSheet, View } from "react-native";

export default function SeparatorRow(){
  return(
    <View style={styles.separatorRow}>
              <View style={styles.separatorLine} />
              <AppText style={styles.separatorText}>o</AppText>
              <View style={styles.separatorLine} />
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
    backgroundColor: Colors.light.text,
    opacity: 0.6,
  },
  separatorText: {
    marginHorizontal: 12,
    color: Colors.light.text,
    fontSize: 20,
  },
 })


