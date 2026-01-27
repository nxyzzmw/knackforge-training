

import Home from '../Screens/Home';
import Show from '../Screens/Show';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Show" component={Show} />
      </Tab.Navigator>
  );
}