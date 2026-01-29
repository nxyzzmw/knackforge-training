import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '../contexts/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
}

const ScreenWrapper = ({ children }: ScreenWrapperProps) => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === 'light' ? '#efeeeeff' : '#000' },
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;
