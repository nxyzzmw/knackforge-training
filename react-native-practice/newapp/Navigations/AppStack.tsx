import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeProvider';
import Home from '../Screens/Home';
import Show from '../Screens/Show';
import Settings from '../Screens/Settings';
import Todo from '../Screens/Todo';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialIcons name="home" color={color} size={size} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialIcons name="person" color={color} size={size} />
);

const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialIcons name="settings" color={color} size={size} />
);

const TodoIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialIcons name="draw" color={color} size={size} />
);

export default function MyTabs() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
          borderTopColor: isDark ? '#333' : '#ccc',
        },
        tabBarActiveTintColor: isDark ? '#fff' : '#000',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#666',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: HomeIcon,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Show}
        options={{
          tabBarIcon: ProfileIcon,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: SettingsIcon,
        }}
      />

      <Tab.Screen
        name="Todo"
        component={Todo}
        options={{
          tabBarIcon: TodoIcon,
        }}
      />
    </Tab.Navigator>
  );
}
