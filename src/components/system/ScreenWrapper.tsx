import { Colors } from "@/src/constants/theme";
import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: ReactNode;
  edges?: ("top" | "bottom" | "left" | "right")[];
  style?: StyleProp<ViewStyle>;
}

export default function ScreenWrapper({ 
  children, 
  edges = ["top"],
  style 
}: ScreenWrapperProps) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: Colors.light.background }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}