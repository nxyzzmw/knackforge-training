import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();

  const isAuth = false;

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth"; // change to "(auth)" if your folder is (auth)

    if (!isAuth && !inAuthGroup) {
      router.replace("/auth");
    }

    if (isAuth && inAuthGroup) {
      router.replace("/");
    }
  });

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <RouteGuard>
      <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" options={{ headerShown: true}} />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </RouteGuard>
  );
}
