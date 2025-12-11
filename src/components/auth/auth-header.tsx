import { Image, View } from "react-native";
import Logo from "../../../assets/images/logo-puff-zero.png";
import { layout } from "../../../src/styles/layout";
import TitleBlockAuth from "./title-block-auth";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={layout.headerRow}>
      <View style={layout.headerTextContainer}>
        <TitleBlockAuth
          title={title}
          subtitle={subtitle}
        />
      </View>

      <Image
        source={Logo}
        style={layout.headerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

