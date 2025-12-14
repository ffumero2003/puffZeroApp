import { Text, TextProps } from "react-native";
import { Colors, Fonts } from "../constants/theme";

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

export default function AppText({ weight = "regular", style, children, ...props }: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: Fonts[weight],
          color: Colors.light.text,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
