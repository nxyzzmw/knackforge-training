import React, { useContext } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeProvider, { ThemeContext } from "./contexts/ThemeProvider";
import { UserContext } from "./contexts/UserContext";
import Toggle from "./components/toggle";
import MyTabs from "./Navigations/AppStack";
import { Text } from "@rneui/base";

function MainApp() {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === "light" ? "white" : "black",
      }}
    ><Text style={{ color: theme === "light" ? "black" : "white", textAlign: "center" , fontWeight: "bold" , fontSize:28}}>React Native App</Text>
      {/* Toggle */}
      <Toggle />

      {/*  Screens below */}
      <View style={{ flex: 1 }}>
        <MyTabs />
      </View>
    </View>
  );
}

export default function App() {
  return (
    
    <SafeAreaView style={{ flex: 1 }}> 
    <ThemeProvider>
      <UserContext.Provider value="Nayeem">
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </UserContext.Provider>
    </ThemeProvider>
    </SafeAreaView>
   
  );
}
