import {
  client,
  COMPLETIONS_COLLECTION_ID,
  DATABASE_ID,
  databases,
  HABITS_COLLECTION_ID,
  RealtimeResponse,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, useColorScheme, ScrollView } from "react-native";
import { Query } from "react-native-appwrite";
import { Card, Text } from "react-native-paper";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function StreaksScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([]);
  const { user } = useAuth();

  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const COLORS = useMemo(
    () => ({
      bg: isDark ? "black" : "#F4F1FF",
      card: isDark ? "#141421" : "#FFFFFF",
      text: isDark ? "#FFFFFF" : "#0F172A",
      muted: isDark ? "#A1A1AA" : "#64748B",
      border: isDark ? "#2A2A36" : "#E5E7EB",
      primary: "#6D28D9",
      purpleSoft: isDark ? "#221A3A" : "#F1ECFF",
      shadow: isDark ? "#000" : "#7C3AED",
      TITLE_PURPLE : isDark? "#A78BFA": "#7C3AED",


      hofGold: "#FFF5CC",
      hofSilver: "#EEF2F7",
      hofBronze: "#FFEAD5",
    }),
    [isDark]
  );

  useEffect(() => {
    if (user) {
      const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
      const habitsSubscription = client.subscribe(
        habitsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabits();
          }
        }
      );

      const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;
      const completionsSubscription = client.subscribe(
        completionsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchCompletions();
          }
        }
      );

      fetchHabits();
      fetchCompletions();

      return () => {
        habitsSubscription();
        completionsSubscription();
      };
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setHabits(response.documents as unknown as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompletions = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      const completions = response.documents as unknown as HabitCompletion[];
      setCompletedHabits(completions);
    } catch (error) {
      console.error(error);
    }
  };

  interface StreakData {
    streak: number;
    bestStreak: number;
    total: number;
  }

  const getStreakData = (habitId: string): StreakData => {
    const habitCompletions = completedHabits
      ?.filter((c) => c.habit_id === habitId)
      .sort(
        (a, b) =>
          new Date(a.completed_at).getTime() -
          new Date(b.completed_at).getTime()
      );

    if (habitCompletions?.length === 0) {
      return { streak: 0, bestStreak: 0, total: 0 };
    }

    let streak = 0;
    let bestStreak = 0;
    let total = habitCompletions.length;

    let lastDate: Date | null = null;
    let currentStreak = 0;

    habitCompletions?.forEach((c) => {
      const date = new Date(c.completed_at);
      if (lastDate) {
        const diff =
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diff <= 1.5) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      if (currentStreak > bestStreak) bestStreak = currentStreak;
      streak = currentStreak;
      lastDate = date;
    });

    return { streak, bestStreak, total };
  };

  const habitStreaks = habits.map((habit) => {
    const { streak, bestStreak, total } = getStreakData(habit.$id);
    return { habit, bestStreak, streak, total };
  });

  const rankedHabits = habitStreaks.sort((a, b) => b.bestStreak - a.bestStreak);

  const top3 = rankedHabits.slice(0, 3);

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: COLORS.text }]}>Streaks</Text>
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: COLORS.muted }]}>
              No Habits yet. Add your first Habit!
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
          >
            {/* Hall of Fame */}
            <Text style={[styles.sectionTitle, { color: COLORS.TITLE_PURPLE }]}>
              Hall of Fame
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 10 }}
            >
              {top3.map((item, idx) => {
                const bg =
                  idx === 0
                    ? COLORS.hofGold
                    : idx === 1
                    ? COLORS.hofSilver
                    : COLORS.hofBronze;

                return (
                  <View key={idx} style={[styles.hofCard, { backgroundColor: bg }]}>
                    <View style={styles.hofTopRow}>
                      <MaterialCommunityIcons
                        name="trophy"
                        size={18}
                        color="#F59E0B"
                      />
                      <View style={styles.rankPill}>
                        <Text style={styles.rankPillText}>#{idx + 1}</Text>
                      </View>
                    </View>

                    <Text style={[styles.hofStreak, { color: "#0F172A" }]}>
                      {item.bestStreak} Day Streak
                    </Text>

                    <Text style={[styles.hofHabit, { color: COLORS.primary }]}>
                      {item.habit.title}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* My Streaks */}
            <Text style={[styles.sectionTitle, { color: COLORS.TITLE_PURPLE, marginTop: 18 }]}>
              My Streaks
            </Text>

            {rankedHabits.map(({ habit, bestStreak }, key) => (
              <Card
                key={key}
                style={[
                  styles.myCard,
                  {
                    backgroundColor: COLORS.card,
                    borderColor: COLORS.border,
                    shadowColor: COLORS.shadow,
                  },
                ]}
              >
                <Card.Content>
                  <View style={styles.rowBetween}>
                    <View style={styles.leftRow}>
                      <View style={[styles.iconBox, { backgroundColor: COLORS.purpleSoft }]}>
                        <MaterialCommunityIcons
                          name="star-four-points"
                          size={18}
                          color={COLORS.primary}
                        />
                      </View>

                      <View style={styles.textBlock}>
                        <Text style={[styles.habitTitle, { color: COLORS.text }]}>
                          {habit.title}
                        </Text>
                        <Text style={[styles.habitSub, { color: COLORS.muted }]}>
                          {habit.description}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.firePill, { backgroundColor: COLORS.purpleSoft }]}>
                      <MaterialCommunityIcons name="fire" size={16} color="#FF6A00" />
                      <Text style={[styles.fireText, { color: COLORS.primary }]}>
                        {bestStreak}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 18,
  },

  header: {
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign:"center"
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },

  emptyState: {
    marginTop: 60,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* Hall of Fame */
  hofCard: {
    width: 190,
    padding: 14,
    borderRadius: 18,
    marginRight: 12,
  },

  hofTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  rankPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(109, 40, 217, 0.14)",
  },

  rankPillText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#6D28D9",
  },

  hofStreak: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  hofHabit: {
    fontSize: 12,
    fontWeight: "800",
  },

  /* My Streaks */
  myCard: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  textBlock: {
  flex: 1,              // ✅ takes remaining space
  marginRight: 10,      // ✅ leaves space for pill
},

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  habitTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  habitSub: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },

  firePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  fireText: {
    fontSize: 13,
    fontWeight: "900",
  },
});
