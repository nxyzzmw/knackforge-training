import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
         
          tabBarActiveTintColor: "coral",
        }}
      >
        <Tabs.Screen
  name="index"
  options={{
    title: "Home",
    tabBarIcon: ({ color, focused }) =>
      focused ? (
<Entypo name="home" size={24} color={color} />
      ) : (
        <Ionicons name="home-outline" size={24} color={color} />
        
      ),
  }}
/>

<Tabs.Screen
  name="login"
  options={{
    title: "Login",
    tabBarIcon: ({ color,  focused }) =>
      focused ? (
<Entypo name="login" size={24} color={color} />
      ) : (
        <SimpleLineIcons name="login" size={24} color={color} />
        
      ),
  }}
/>

      </Tabs>
    </>
  );
}
