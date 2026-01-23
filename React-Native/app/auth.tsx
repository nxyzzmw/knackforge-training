import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View, useColorScheme } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";


export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const PRIMARY = "#6D28D9";

  const COLORS = {
    bg: isDark ? "black" : "#F4F1FF",
    card: isDark ? "#141421" : "#FFFFFF",
    inputBg: isDark ? "#1C1C28" : "#F7FAFC",
    text: isDark ? "#FFFFFF" : "#111827",
    muted: "#9CA3AF",
    outline: isDark ? "#2A2A36" : "#E5E7EB",
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Passwords must be at least 6 characters long.");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }

      router.replace("/");
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: COLORS.bg }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: COLORS.text }]}>
          {isSignUp ? "Create Account" : "Welcome Back!"}
        </Text>

        <View style={[styles.card, { backgroundColor: COLORS.card }]}>
          <Text style={[styles.label, { color: COLORS.muted }]}>EMAIL</Text>

          <TextInput
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="example@gmail.com"
            mode="outlined"
            value={email}
            style={[styles.input, { backgroundColor: COLORS.inputBg }]}
            outlineStyle={styles.outline}
            contentStyle={[styles.inputContent, { color: COLORS.text }]}
            textColor={COLORS.text}
            placeholderTextColor={COLORS.muted}
            cursorColor={PRIMARY}
            selectionColor={PRIMARY}
            onChangeText={setEmail}
            theme={{
              roundness: 20,
              colors: {
                primary: PRIMARY,
                outline: COLORS.outline,
                background: COLORS.inputBg,
              },
            }}
          />

          <Text style={[styles.label, { color: COLORS.muted, marginTop: 10 }]}>
            PASSWORD
          </Text>

          <TextInput
            label="Password"
            autoCapitalize="none"
            mode="outlined"
            secureTextEntry
            value={password}
            style={[styles.input, { backgroundColor: COLORS.inputBg }]}
            outlineStyle={styles.outline}
            contentStyle={[styles.inputContent, { color: COLORS.text }]}
            textColor={COLORS.text}
            placeholderTextColor={COLORS.muted}
            cursorColor={PRIMARY}
            selectionColor={PRIMARY}
            onChangeText={setPassword}
            theme={{
              roundness: 20,
              colors: {
                primary: PRIMARY,
                outline: COLORS.outline,
                background: COLORS.inputBg,
              },
            }}
          />

          {error && <Text style={{ color: theme.colors.error, marginTop: 8 }}>{error}</Text>}

          <Button
            mode="contained"
            style={[styles.button, { backgroundColor: PRIMARY }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            onPress={handleAuth}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <Button
            mode="text"
            onPress={handleSwitchMode}
            style={styles.switchModeButton}
            labelStyle={{ color: PRIMARY, fontWeight: "700" }}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 18,
  },

  card: {
    borderRadius: 34,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },

  label: {
    fontSize: 13,
    letterSpacing: 1.2,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    marginBottom: 14,
  },

  outline: {
    borderRadius: 20,
  },

  inputContent: {
    fontSize: 16,
    paddingLeft: 18,
    paddingRight: 18,
    paddingVertical: 14,
  },

  button: {
    marginTop: 10,
    borderRadius: 22,
  },

  buttonContent: {
    height: 58,
  },

  buttonLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },

  switchModeButton: {
    marginTop: 6,
  },
});
