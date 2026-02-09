import { Fonts } from "@/src/constants/theme";
// NEW: Import useThemeColors instead of static Colors
import { useThemeColors } from "@/src/providers/theme-provider";
import { Text, TextProps } from "react-native";

type FontWeightOption =
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold";

interface AppTextProps extends TextProps {
  weight?: FontWeightOption;
  style?: any;
  children: React.ReactNode;
}

export default function AppText({
  weight = "regular",
  style,
  children,
  ...props
}: AppTextProps) {
  const colors = useThemeColors();

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: Fonts[weight],
          color: colors.text,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
