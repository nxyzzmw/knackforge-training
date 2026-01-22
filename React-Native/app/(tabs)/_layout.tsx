import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const border = isDark ? "#2A2A36" : "#E5E7EB";
  const inactive = isDark ? "#A1A1AA" : "#6B7280";
  const active = "#6D28D9";
    const bg= isDark ? "#141421" : "#FFFFFF";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
tabBarStyle: {
  position: "absolute",
left: "50%",
  transform: [{ translateX: 25 }], // ✅ half of width below
  width: "90%",    bottom: 16,

  height: 74,
  paddingBottom: 12,

  borderRadius: 26,
  backgroundColor: bg,
  borderWidth: 1,
  borderColor: border,

  shadowColor: "#000",
  shadowOpacity: 0.10,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 10 },
  elevation: 8,
},
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: "700",
          marginTop: 6,
        },

       tabBarItemStyle: {
 borderRadius: 18,
          paddingVertical: 6,
          justifyContent: "center",
          alignItems: "center",
          left:8,
  
  
 
},



      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habits",
           headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons   name="calendar-today" size={size} color={color} />
          ),
        }}
      />

        <Tabs.Screen
        name="add-habit"
        options={{
          title: "Add Habit",
           headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
          ),
        }}
      />


          <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",
           headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          ),
        }}
      />
    
    </Tabs>

   
  );
}
