import Logo from "@/assets/images/logo-puff-zero.png";
import { components } from "@/src/styles/components";
import { Image, View } from "react-native";
import TitleBlockAuth from "./TitleBlockAuth";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={components.headerRow}>
      <View style={components.headerTextContainer}>
        <TitleBlockAuth
          title={title}
          subtitle={subtitle}
        />
      </View>

      <Image
        source={Logo}
        style={components.headerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

