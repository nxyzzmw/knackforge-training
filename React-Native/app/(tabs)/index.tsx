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
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";
import ScreenWrapper from "@/components/ScreenWrapper";
export default function Index() {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>();
  const [completedHabits, setCompletedHabits] = useState<string[]>();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

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
      setHabits(response.documents as Habit[]);
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
      const completions = response.documents as HabitCompletion[];
      setCompletedHabits(completions.map((c) => c.habit_id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteHabit = async (id: string) => {
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
  <View style={styles.container}>
    {/* Top Header */}
    <View style={styles.topBar}>
      <View>
        <Text style={styles.subTitle}>MY JOURNEY</Text>
        <Text style={styles.mainTitle}>Today's Habits</Text>
      </View>

      <Button
        mode="outlined"
        onPress={signOut}
        icon={() => (
          <MaterialCommunityIcons name="logout" size={18} color="#4B5563" />
        )}
        style={styles.signOutBtn}
        labelStyle={styles.signOutText}
        contentStyle={{ flexDirection: "row-reverse" }}
      >
        Sign Out
      </Button>
    </View>

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
      {habits?.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No Habits yet. Add your first Habit!
          </Text>
        </View>
      ) : (
        habits?.map((habit) => (
          <Swipeable
            ref={(ref) => {
              swipeableRefs.current[habit.$id] = ref;
            }}
            key={habit.$id}
            overshootLeft={false}
            overshootRight={false}
            renderLeftActions={renderLeftActions}
            renderRightActions={() => renderRightActions(habit.$id)}
            onSwipeableOpen={(direction) => {
              if (direction === "left") handleDeleteHabit(habit.$id);
              if (direction === "right") handleCompleteHabit(habit.$id);

              swipeableRefs.current[habit.$id]?.close();
            }}
          >
            <Surface
              elevation={0}
              style={[
                styles.card,
                isHabitCompleted(habit.$id) && styles.cardCompleted,
              ]}
            >
              <Text style={styles.cardTitle}>{habit.title}</Text>
              <Text style={styles.cardDescription}>{habit.description}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.streakPill}>
                  <MaterialCommunityIcons name="fire" size={16} color="#FF6A00" />
                  <Text style={styles.streakText}>
                    {habit.streak_count} DAY STREAK
                  </Text>
                </View>

                <View style={styles.freqPill}>
                  <Text style={styles.freqText}>
                    {habit.frequency.toUpperCase()}
                  </Text>
                </View>
              </View>
            </Surface>
          </Swipeable>
        ))
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
    backgroundColor: "#F7F6FF",
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
    color: "#A78BFA",
    marginBottom: 2,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
  },

  signOutBtn: {
    borderRadius: 999,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  signOutText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,

    // shadow (iOS)
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,

    // shadow (Android)
    elevation: 6,
  },

  cardCompleted: {
    opacity: 0.6,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 14,
    color: "#64748B",
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
    backgroundColor: "#FFF1E8",
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
    color: "#FF6A00",
    letterSpacing: 0.6,
  },

  freqPill: {
    backgroundColor: "#F1ECFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },

  freqText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: "#7C3AED",
  },

  emptyState: {
    marginTop: 60,
    alignItems: "center",
  },

  emptyStateText: {
    color: "#6B7280",
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
