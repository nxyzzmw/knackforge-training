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
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function Index() {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>();
  const [completedHabits, setCompletedHabits] = useState<string[]>();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  // ✅ prevents Swipeable double trigger (mobile fix)
  const swipeLockRef = useRef<{ [key: string]: boolean }>({});

  // ✅ Dark/Light mode
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const COLORS = {
    bg: isDark ? "black" : "#F4F1FF",
    text: isDark ? "#FFFFFF" : "#0F172A",
    muted: isDark ? "#A1A1AA" : "#64748B",
    card: isDark ? "#141421" : "#FFFFFF",
    border: isDark ? "#2A2A36" : "#E5E7EB",

    titlePurple: "#A78BFA",
    shadow: isDark ? "#000" : "#7C3AED",

    signOutBg: isDark ? "#141421" : "#FFFFFF",
    signOutText: isDark ? "#F87171" : "#F87171",

    streakBg: isDark ? "#2B1C13" : "#FFF1E8",
    streakText: "#FF6A00",

    freqBg: isDark ? "#221A3A" : "#F1ECFF",
    freqText: "#7C3AED",
  };

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
            fetchTodayCompletions();
          }
        }
      );

      fetchHabits();
      fetchTodayCompletions();

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

  const fetchTodayCompletions = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [
          Query.equal("user_id", user?.$id ?? ""),
          Query.greaterThanEqual("completed_at", today.toISOString()),
        ]
      );
     const completions = response.documents as unknown as HabitCompletion[];

      setCompletedHabits(completions.map((c) => c.habit_id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (!id) return; // ✅ guard
    try {
      await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteHabit = async (id: string) => {
    if (!id) return; // ✅ guard
    if (!user || completedHabits?.includes(id)) return;

    try {
      const currentDate = new Date().toISOString();

      await databases.createDocument(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        ID.unique(),
        {
          habit_id: id,
          user_id: user.$id,
          completed_at: currentDate,
        }
      );

      const habit = habits?.find((h) => h.$id === id);
      if (!habit) return;

      await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, {
        streak_count: habit.streak_count + 1,
        last_completed: currentDate,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isHabitCompleted = (habitId: string) =>
    completedHabits?.includes(habitId);

  const renderRightActions = (habitId: string) => (
    <View style={styles.swipeActionRight}>
      {isHabitCompleted(habitId) ? (
        <Text style={{ color: "#fff" }}> Completed!</Text>
      ) : (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={32}
          color={"#fff"}
        />
      )}
    </View>
  );

  const renderLeftActions = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color={"#fff"}
      />
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.subTitle, { color: COLORS.titlePurple }]}>
              MY JOURNEY
            </Text>
            <Text style={[styles.mainTitle, { color: COLORS.text }]}>
              Today&apos;s Habits
            </Text>
          </View>

          <Button
            mode="outlined"
            onPress={signOut}
            icon={() => (
              <MaterialCommunityIcons
                name="logout"
                size={18}
                color={COLORS.signOutText}
              />
            )}
            style={[
              styles.signOutBtn,
              { backgroundColor: COLORS.signOutBg, borderColor: COLORS.border },
            ]}
            labelStyle={[styles.signOutText, { color: COLORS.signOutText }]}
            contentStyle={{ flexDirection: "row-reverse" }}
          >
            Sign Out
          </Button>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {habits?.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: COLORS.muted }]}>
                No Habits yet. Add your first Habit!
              </Text>
            </View>
          ) : (
            habits?.map((habit) => {
              const completed = isHabitCompleted(habit.$id);

              return (
                <Swipeable
                  ref={(ref) => {
                    swipeableRefs.current[habit.$id] = ref;
                  }}
                  key={habit.$id}
                  overshootLeft={false}
                  overshootRight={false}
                  renderLeftActions={renderLeftActions}
                  renderRightActions={() =>
                    completed ? null : renderRightActions(habit.$id)
                  }
                  onSwipeableOpen={(direction) => {
                    // ✅ mobile fix: prevent double trigger
                    if (swipeLockRef.current[habit.$id]) {
                      swipeableRefs.current[habit.$id]?.close();
                      return;
                    }

                    swipeLockRef.current[habit.$id] = true;

                    if (direction === "left") {
                      handleDeleteHabit(habit.$id);
                    }

                    if (direction === "right" && !completed) {
                      handleCompleteHabit(habit.$id);
                    }

                    setTimeout(() => {
                      swipeableRefs.current[habit.$id]?.close();
                      swipeLockRef.current[habit.$id] = false;
                    }, 500);
                  }}
                >
                  <Surface
                    elevation={0}
                    style={[
                      styles.card,
                      {
                        backgroundColor: COLORS.card,
                        shadowColor: COLORS.shadow,
                      },
                   
                   
                    ]}
                  >
                    {/* ✅ opacity applied INSIDE (works on real phone) */}
                    <View style={completed ? styles.cardInnerCompleted : undefined}>
                      <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                        {habit.title}
                      </Text>

                      <Text
                        style={[
                          styles.cardDescription,
                          { color: COLORS.muted },
                        ]}
                      >
                        {habit.description}
                      </Text>

                      <View style={styles.cardFooter}>
                        <View
                          style={[
                            styles.streakPill,
                            { backgroundColor: COLORS.streakBg },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="fire"
                            size={16}
                            color={COLORS.streakText}
                          />
                          <Text
                            style={[
                              styles.streakText,
                              { color: COLORS.streakText },
                            ]}
                          >
                            {habit.streak_count} Day Streak
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.freqPill,
                            { backgroundColor: COLORS.freqBg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.freqText,
                              { color: COLORS.freqText },
                            ]}
                          >
                            {habit.frequency.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Surface>
                </Swipeable>
              );
            })
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  subTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 2,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: "900",
  },

  signOutBtn: {
    borderRadius: 999,
  },

  signOutText: {
    fontSize: 13,
    fontWeight: "700",
  },

  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,

    // shadow (iOS)
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,

    // shadow (Android)
    elevation: 6,
  },

  // ✅ mobile visible completed style
  cardInnerCompleted: {
    opacity: 0.4,
  },

 

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,

    shadowColor: "#FF6A00",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },

  streakText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  freqPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },

  freqText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  emptyState: {
    marginTop: 60,
    alignItems: "center",
  },

  emptyStateText: {
    fontSize: 14,
  },

  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#EF4444",
    borderRadius: 22,
    marginBottom: 18,
    paddingLeft: 16,
  },

  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#22C55E",
    borderRadius: 22,
    marginBottom: 18,
    paddingRight: 16,
  },
});
