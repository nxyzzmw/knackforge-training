import React, { useContext } from "react";
import { Button, View, StyleSheet } from "react-native";
import { ThemeContext } from "../contexts/ThemeProvider";

export default function Toggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
    <View style={styles.container}>
      <Button  title={`Toggle Theme (${theme})`} onPress={toggleTheme} />
      
    </View>
           <View style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width:200,
    alignSelf:'center'
  },
 divider: {
    height: 1,
    width: 'auto',
    backgroundColor: '#ccc',
    marginVertical: 10,
    marginHorizontal: 10,
  }
});
