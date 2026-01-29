import React, { useState } from 'react';
import {
  Text,
  ScrollView,
  KeyboardAvoidingView,
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Platform,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { ThemeContext } from '../contexts/ThemeProvider';
import { useContext } from 'react';

export default function Settings() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [NameError, setNameError] = useState('');
  const [EmailError, setEmailError] = useState('');
  const [PhoneError, setPhoneError] = useState('');
  function Validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setNameError('Name should contain only letters and spaces');
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
    }
    if (
      nameRegex.test(name) &&
      emailRegex.test(email) &&
      phoneRegex.test(phone)
    ) {
      Alert.alert('Success', 'Form submitted successfully!');
      setEmailError('');
      setPhoneError('');
      setNameError('');
      setName('');
      setEmail('');
      setPhone('');
    }
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <Text style={[styles.heading, { color: isDark ? 'white' : 'black' }]}>
            FORM VALIDATION
          </Text>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Text> Name</Text>
              </View>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#999"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.errorText}>{NameError}</Text>
              <View style={styles.inputContainer}>
                <Text> Email</Text>
              </View>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#999"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
              <Text style={styles.errorText}>{EmailError}</Text>
              <View style={styles.inputContainer}>
                <Text> Phone</Text>
              </View>
              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor="#999"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
              />
              <Text style={styles.errorText}>{PhoneError}</Text>
              <View style={styles.button}>
                <Button title="Submit" onPress={Validate} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    textAlignVertical: 'top',
    marginTop: 10,
    width: '100%',
  },
  button: {
    width: 100,
    marginTop: 20,
    alignSelf: 'center',
  },

  inputContainer: {
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 10,
  },
});
