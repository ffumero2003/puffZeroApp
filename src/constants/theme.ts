// constants/theme.ts

// Type for theme color palettes - used by ThemeProvider
export type ThemeColors = typeof Colors.light;

// Theme preference options
export type ThemePreference = "light" | "dark" | "system";

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

    // Semantic tokens (new - for cards, inputs, etc.)
    card: "#FFFFFF",
    cardBorder: "#C9D2FB",
    inputBackground: "#E6E4FF",
    switchTrackOff: "#ccc",
  },
  dark: {
    // Core brand - deep navy with purple undertone
    background: "#0F0F1A",
    secondaryBackground: "#1A1A2E",
    primary: "#7B8FFF", // brighter version of #5974FF for contrast on dark
    secondary: "#252540",

    // Text - light grays with slight blue undertone
    text: "#E8E8F0",
    textSecondary: "#D0D0E0",
    textMuted: "#8888AA",
    textWhite: "#fff",

    // Borders
    border: "#3D3D5C",

    // UI elements
    tint: "#7B8FFF",
    icon: "#7B8FFF",

    // Tabs
    tabIconDefault: "#8888AA",
    tabIconSelected: "#7B8FFF",

    // States - slightly brighter for readability on dark
    success: "#66BB6A",
    danger: "#FF6B6B",
    warning: "#FFCA40",

    // Semantic tokens
    card: "#1A1A2E",
    cardBorder: "#3D3D5C",
    inputBackground: "#252540",
    switchTrackOff: "#555",
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

