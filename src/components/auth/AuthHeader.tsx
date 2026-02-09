import Logo from "@/assets/images/logo-puff-zero.png";
import TitleBlockAuth from "@/src/components/auth/TitleBlockAuth";
import { useThemeColors } from "@/src/providers/theme-provider";
import { components } from "@/src/styles/components";
import { Image, View } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[components.headerRow, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          components.headerTextContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <TitleBlockAuth title={title} subtitle={subtitle} />
      </View>

      <Image source={Logo} style={components.headerLogo} resizeMode="contain" />
    </View>
  );
}
