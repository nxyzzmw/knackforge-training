import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
import ScreenWrapper from "@/components/ScreenWrapper";

const FREQUENCIES = ["daily", "weekly", "monthly"] as const;
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error, setError] = useState<string>("");

  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

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
    segmentWrap: isDark ? "#1C1C28" : "#F4F6FB",
    segmentSurface: isDark ? "#1C1C28" : "#EEF2F7",
  };

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && description.trim().length > 0;
  }, [title, description]);

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title: title.trim(),
          description: description.trim(),
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );

      // ✅ clear fields (works because inputs are controlled with value)
      setTitle("");
      setDescription("");
      setFrequency("daily");
      setError("");

      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("There was an error creating the habit");
    }
  };

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
        {/* Header */}
        <Text style={[styles.title, { color: COLORS.text }]}>Add New Habit</Text>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: COLORS.card }]}>
          <Text style={[styles.label, { color: COLORS.muted }]}>HABIT NAME</Text>

          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={[styles.input, { backgroundColor: COLORS.inputBg }]}
            outlineStyle={styles.outline}
            contentStyle={[styles.inputContent, { color: COLORS.text }]}
            textColor={COLORS.text}
            placeholderTextColor={COLORS.muted}
            cursorColor={PRIMARY}
            selectionColor={PRIMARY}
            theme={{
              roundness: 20,
              colors: {
                primary: PRIMARY,
                outline: COLORS.outline,
                background: COLORS.inputBg,
              },
            }}
          />

          <Text style={[styles.label, { color: COLORS.muted, marginTop: 14 }]}>
            DESCRIPTION
          </Text>

          <TextInput
            label="Description"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, styles.textArea, { backgroundColor: COLORS.inputBg }]}
            outlineStyle={styles.outline}
            contentStyle={[styles.inputContent, { paddingTop: 14, color: COLORS.text }]}
            textColor={COLORS.text}
            placeholderTextColor={COLORS.muted}
            cursorColor={PRIMARY}
            selectionColor={PRIMARY}
            theme={{
              roundness: 20,
              colors: {
                primary: PRIMARY,
                outline: COLORS.outline,
                background: COLORS.inputBg,
              },
            }}
          />

          <Text style={[styles.label, { color: COLORS.muted, marginTop: 18 }]}>
            FREQUENCY
          </Text>

          <View style={styles.frequencyContainer}>
            <SegmentedButtons
              value={frequency}
              onValueChange={(value) => setFrequency(value as Frequency)}
              buttons={FREQUENCIES.map((freq) => ({
                value: freq,
                label: freq.charAt(0).toUpperCase() + freq.slice(1),

              }))}
              style={[
                styles.segmentWrap,
                { backgroundColor: COLORS.segmentWrap },
              ]}
              theme={{
                roundness: 18,
                colors: {
                  secondaryContainer: PRIMARY,
                  onSecondaryContainer: "#FFFFFF",

                  surface: COLORS.segmentSurface,
                  onSurface: COLORS.text, // ✅ fixes white text on phone

                  outline: COLORS.outline,
                },
              }}
            />
          </View>
        </View>

        {/* Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={[styles.addBtn, { backgroundColor: PRIMARY }]}
          contentStyle={styles.addBtnContent}
          labelStyle={styles.addBtnLabel}
         
        >
          Add Habit
        </Button>

        {error && <Text style={{ color: theme.colors.error, marginTop: 10 }}>{error}</Text>}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 18,
  },

  card: {
    borderRadius: 34,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    letterSpacing: 1.2,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    marginBottom: 0,
  },

  outline: {
    borderRadius: 20,
  },

  inputContent: {
    fontSize: 18,
    paddingLeft: 18,
    paddingRight: 18,
    paddingVertical: 16,
  },

  textArea: {
    height: 110,
  },

  frequencyContainer: {
    marginBottom: 0,
    marginTop: 10,
  },

  segmentWrap: {
    borderRadius: 18,
    padding: 6,
  },

  addBtn: {
    borderRadius: 22,
  },

  addBtnContent: {
    height: 64,
    flexDirection: "row-reverse",
  },

  addBtnLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
});
