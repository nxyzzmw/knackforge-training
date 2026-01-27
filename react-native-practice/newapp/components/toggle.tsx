import React, { useContext } from "react";
import { Button, View, StyleSheet } from "react-native";
import { ThemeContext } from "../contexts/ThemeProvider";

export default function Toggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Button title={`Toggle Theme (${theme})`} onPress={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
