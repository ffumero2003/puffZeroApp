// app/(app)/_layout.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
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
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        {
          backgroundColor: focused
            ? Colors.light.primary
            : Colors.light.secondary,
        },
      ]}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={focused ? Colors.light.textWhite : Colors.light.text}
      />
      <AppText
        weight="semibold"
        style={[
          styles.tabLabel,
          {
            color: focused ? Colors.light.textWhite : Colors.light.text,
          },
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export default function AppLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.light.background,
            borderTopWidth: 0,
            elevation: 0,
            height: 80,
            paddingBottom: 10,
            paddingTop: 10,
            paddingHorizontal: 16,
          },
        }}
        tabBar={(props) => (
          <View style={styles.tabBarContainer}>
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

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
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
