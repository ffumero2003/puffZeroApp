/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// constants/theme.ts

export const Colors = {
  light: {
    // Core brand
    background: "#F6F3FF",
    secondaryBackground: "#FFF",
    primary: "#5974FF",
    secondary: "#E5E0FF",

    // Text
    text: "#1F2859",
    textSecondary: "#000000",
    textMuted: "#828dbdff",
    textWhite: "#fff",

    // Borders
    border: "#C7C2FF",

    // UI elements
    tint: "#5974FF",
    icon: "#5974FF",

    // Tabs
    tabIconDefault: "#737AA5",
    tabIconSelected: "#5974FF",

    // States
    success: "#4CAF50",
    danger: "#FF4D4D",
    warning: "#FFB020",
  },

  dark: {
    background: "#0E0E12",
    primary: "#5974FF",
    secondary: "#2A2740",

    text: "#FFFFFF",
    textSecondary: "#C8C8D5",
    textMuted: "#9A9AAF",

    border: "#3B345A",

    tint: "#5974FF",
    icon: "#5974FF",

    tabIconDefault: "#777",
    tabIconSelected: "#5974FF",

    success: "#4CAF50",
    danger: "#FF4D4D",
    warning: "#FFB020",
  },
};

// Manrope font family mapping for consistent usage
export const Fonts = {
  light: "Manrope_300Light",
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  extrabold: "Manrope_800ExtraBold",
};


