import { components } from "@/src/styles/components";
import { View, ViewStyle } from "react-native";

interface Props {
  style?: ViewStyle;
}

export default function AppHeader({ style }: Props) {

  return (
    <View style={[components.wrapper, style]}>
      

    </View>
  );
}

