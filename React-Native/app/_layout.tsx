import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/");
    }
  }, [user, segments, isLoadingUser]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const appTheme = isDark
    ? {
        ...MD3DarkTheme,
        colors: {
          ...MD3DarkTheme.colors,
          primary: "#6D28D9",
          background: "#0B0B10",
          surface: "#141421",
        },
      }
    : {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          primary: "#6D28D9",
          background: "#F4F1FF",
          surface: "#FFFFFF",
        },
      };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider theme={appTheme}>
          <SafeAreaProvider>
            <RouteGuard>
              <Stack>
                {/* Tabs (Home) */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Auth Header */}
                <Stack.Screen
                  name="auth"
                  options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    headerStyle: {
                      backgroundColor: isDark ? "#0B0B10" : "#F4F1FF",
                    },
                    headerTitleAlign: "center",
                    headerTitle: () => (
                      <View style={styles.headerTitleCenter}>
                        <View style={styles.logoBox}>
                          <Octicons name="tracked-by-closed-completed" size={24} color="white" />
                        </View>
                        <Text
                          style={[
                            styles.brandText,
                            { color: isDark ? "#FFFFFF" : "#111827" },
                          ]}
                        >
                          HabitFlow
                        </Text>
                      </View>
                    ),
                  }}
                />
              </Stack>
            </RouteGuard>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerTitleCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#6D28D9",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontSize: 18,
    fontWeight: "800",
  },
});
