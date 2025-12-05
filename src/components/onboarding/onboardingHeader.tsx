import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import BackArrow from "../../../assets/images/icons/back.png";
import { Colors } from "../../constants/theme";

interface Props {
  step?: number;        // opcional para login
  total?: number;       // opcional para login
  showBack?: boolean;   // mostrar botón back
  showProgress?: boolean; // mostrar u ocultar progress bar
  style?: ViewStyle;
}

export default function OnboardingHeader({
  step = 1,
  total = 1,
  showBack = true,
  showProgress = true,
  style
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  const percentage = step / total;

  useEffect(() => {
    if (showProgress) {
      Animated.timing(progress, {
        toValue: percentage,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [step, showProgress]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.wrapper, style]}>
      
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image
            source={BackArrow}
            style={{ width: 30, height: 30, tintColor: Colors.light.text }}
          />
        </TouchableOpacity>
      )}

      {showProgress && (
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressFill, { width: widthInterpolated }]} />
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 40,
    gap: 10,
  },
  backButton: {
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
    height: 16,
    backgroundColor: Colors.light.secondary,
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
  },
});
