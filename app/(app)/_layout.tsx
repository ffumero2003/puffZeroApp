// app/(app)/_layout.tsx
import AppText from "@/src/components/AppText";
// NEW: Import useThemeColors instead of static Colors
import { useThemeColors } from "@/src/providers/theme-provider";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function CustomTabBarButton({
  focused,
  label,
  icon,
  onPress,
}: {
  focused: boolean;
  label: string;
  icon: string;
  onPress: () => void;
}) {
  // NEW: Dynamic colors from theme
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={[
        styles.tabButton,
        {
          // NEW: Dynamic background based on focused state + theme
          backgroundColor: focused ? colors.primary : colors.secondary,
        },
      ]}
    >
      <Ionicons
        name={icon as any}
        size={20}
        // NEW: Dynamic icon color
        color={focused ? colors.textWhite : colors.text}
      />
      <AppText
        weight="semibold"
        style={[
          styles.tabLabel,
          {
            // NEW: Dynamic label color
            color: focused ? colors.textWhite : colors.text,
          },
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export default function AppLayout() {
  // NEW: Dynamic colors for the tab bar container and safe area
  const colors = useThemeColors();

  return (
    // NEW: Dynamic SafeAreaView background prevents white strip in dark mode
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            // NEW: Dynamic tab bar background
            backgroundColor: colors.background,
            borderTopWidth: 0,
            elevation: 0,
            height: 80,
            paddingBottom: 10,
            paddingTop: 10,
            paddingHorizontal: 16,
          },
        }}
        tabBar={(props) => (
          // NEW: Dynamic tab bar container background
          <View
            style={[
              styles.tabBarContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <CustomTabBarButton
              focused={props.state.index === 0}
              label="Home"
              icon="home"
              onPress={() => props.navigation.navigate("home")}
            />
            <CustomTabBarButton
              focused={props.state.index === 1}
              label="Progreso"
              icon="stats-chart"
              onPress={() => props.navigation.navigate("progress")}
            />
            <CustomTabBarButton
              focused={props.state.index === 2}
              label="Zuffy"
              icon="sparkles-outline"
              onPress={() => props.navigation.navigate("zuffy")}
            />
            <CustomTabBarButton
              focused={props.state.index === 3}
              label="Perfil"
              icon="person"
              onPress={() => props.navigation.navigate("settings")}
            />
          </View>
        )}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="progress" />
        <Tabs.Screen name="zuffy" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </SafeAreaView>
  );
}

// Static styles - only non-color properties remain here
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 12,
    paddingBottom: 20,
    gap: 8,
    borderTopWidth: 0,
    elevation: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 50,
    gap: 4,
  },
  tabLabel: {
    fontSize: 14,
  },
});
