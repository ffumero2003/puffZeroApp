// src/providers/theme-provider.tsx
// Provides theme context to the entire app.
// Supports light, dark, and system (follows device) preferences.
// Persists the user's choice in AsyncStorage.

import { Colors, ThemeColors, ThemePreference } from "@/src/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

// AsyncStorage key for persisting theme preference
const THEME_PREFERENCE_KEY = "theme_preference";

// Shape of the theme context
interface ThemeContextType {
  themePreference: ThemePreference; // What the user chose: "light" | "dark" | "system"
  activeTheme: "light" | "dark"; // The resolved theme after applying system preference
  colors: ThemeColors; // The active color palette
  setThemePreference: (pref: ThemePreference) => void; // Change the preference
}

// Create context with light defaults (safe fallback)
const ThemeContext = createContext<ThemeContextType>({
  themePreference: "system",
  activeTheme: "light",
  colors: Colors.light,
  setThemePreference: () => {},
});

// Provider component - wrap your app with this
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>("system");
  const [loaded, setLoaded] = useState(false);

  // React Native's hook that returns the device's current color scheme
  const systemColorScheme = useColorScheme();

  // Resolve the active theme based on preference + system setting
  const activeTheme: "light" | "dark" =
    themePreference === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themePreference;

  // Get the correct color palette
  const colors = Colors[activeTheme];

  // Load saved preference from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (saved === "light" || saved === "dark" || saved === "system") {
          setThemePreferenceState(saved);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Save preference to AsyncStorage whenever it changes
  const setThemePreference = async (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, pref);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Don't render children until we've loaded the saved preference
  // to avoid a flash of the wrong theme
  if (!loaded) return null;

  return (
    <ThemeContext.Provider
      value={{ themePreference, activeTheme, colors, setThemePreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to access the full theme context (preference, setter, etc.)
export function useTheme() {
  return useContext(ThemeContext);
}

// Convenience hook - just returns the active color palette
export function useThemeColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}
