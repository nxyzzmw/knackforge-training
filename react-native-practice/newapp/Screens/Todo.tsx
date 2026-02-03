import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Image,
  ScrollView,
} from 'react-native';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@rneui/base';
import ScreenWrapper from '../components/ScreenWrapper';

interface TodoItem {
  text: string;
  photo: string | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function Todo() {
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const STORAGE_KEY = 'MY_TODOS';

  // ================= CAMERA PERMISSION =================
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Todo App Camera Permission',
          message:
            'Todo App needs access to your camera so you can attach photos to your todos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // ================= LOCATION PERMISSION =================
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Todo App Location Permission',
          message:
            'Todo App needs access to your location so you can attach it to your todo.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // ================= LOAD TODOS =================
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setTodos(JSON.parse(saved));
    } catch (e) {
      console.log('Failed to load todos', e);
    }
  };

  // ================= SAVE TODOS =================
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos)).catch(console.log);
  }, [todos]);

  // ================= CAMERA =================
  const openCamera = async () => {
    const hasPermission =
      Platform.OS === 'android' ? await requestCameraPermission() : true;

    if (!hasPermission) {
      Alert.alert('Permission denied', 'Camera access is required');
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.7,
      saveToPhotos: false,
    };

    try {
      const result = await launchCamera(options);

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Camera error', result.errorMessage || 'Unknown error');
        return;
      }

      const uri = result.assets?.[0]?.uri;
      if (uri) setPhoto(uri);
    } catch (error) {
      Alert.alert('Failed to open camera', String(error));
    }
  };

  // ================= LOCATION =================
  const addLocation = async () => {
    const hasPermission =
      Platform.OS === 'android' ? await requestLocationPermission() : true;

    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location access is required');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        Alert.alert('Location error', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  // ================= ADD / UPDATE TODO =================
  const handleTodo = () => {
    if (!description.trim()) return;

    const newTodo: TodoItem = {
      text: description.trim(),
      photo,
      location,
    };

    if (editIndex !== null) {
      const updated = [...todos];
      updated[editIndex] = newTodo;
      setTodos(updated);
      setEditIndex(null);
    } else {
      setTodos([...todos, newTodo]);
    }

    setDescription('');
    setPhoto(null);
    setLocation(null);
  };

  // ================= OPTIONS =================
  const showTodoOptions = (todo: TodoItem, index: number) => {
    Alert.alert('Todo Options', todo.text, [
      {
        text: 'Edit',
        onPress: () => {
          setDescription(todo.text);
          setPhoto(todo.photo);
          setLocation(todo.location);
          setEditIndex(index);
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setTodos(todos.filter((_, i) => i !== index));
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // ================= UI =================
  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.container}>
            <View style={styles.card}>
              <Text style={styles.title}>Todo</Text>

              <TextInput
                placeholder="Write your todo..."
                placeholderTextColor="black"
                value={description}
                onChangeText={setDescription}
                multiline
                style={styles.input}
              />
<View style={styles.buttonGroup}>
              <Button title="Take Photo" onPress={openCamera} />
              <Button title="Add Location" onPress={addLocation} />

              {photo && <Image source={{ uri: photo }} style={styles.image} />}

              <Button
                title={editIndex !== null ? 'Update Todo' : 'Add Todo'}
                onPress={handleTodo}
              />
            </View>
</View>
            <View style={styles.card}>
              <Text style={styles.title}>Your Todos</Text>

              {todos.map((todo, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => showTodoOptions(todo, index)}
                >
                  <Text style={styles.todoItem}>• {todo.text}</Text>

                  {todo.photo && (
                    <Image
                      source={{ uri: todo.photo }}
                      style={styles.todoImage}
                    />
                  )}

                  {todo.location && (
                    <Text style={{ fontSize: 12, color: 'gray' }}>
                      📍 {todo.location.latitude},{' '}
                      {todo.location.longitude}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    minHeight: 80,
    marginTop: 10,
    color: 'black',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 6,
    marginTop: 20,
  },
  todoItem: { fontSize: 16, marginTop: 10 },
  image: { width: 200, height: 200, marginVertical: 10, borderRadius: 10 },
  todoImage: { width: 120, height: 120, borderRadius: 10, marginTop: 5 },
  buttonGroup: {
  marginTop: 15,
  gap: 10,
},

});
