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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera } from "react-native-image-picker";
import { Button } from '@rneui/base';

import ScreenWrapper from '../components/ScreenWrapper';

interface TodoItem {
  text: string;
  photo: string | null;
}

export default function Todo() {

  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const STORAGE_KEY = "MY_TODOS";

  // ================= CAMERA PERMISSION =================
  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert("Camera permission denied");
      return;
    }

    launchCamera(
      {
        mediaType: "photo",
        cameraType: "back",
        saveToPhotos: true,
      },
      (response) => {
        if (response.assets && response.assets[0].uri) {
          setPhoto(response.assets[0].uri);
        }
      }
    );
  };

  // ================= LOAD TODOS =================
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setTodos(JSON.parse(saved));
      }
    } catch (e) {
      console.log("Failed to load todos", e);
    }
  };

  // ================= SAVE TODOS =================
  useEffect(() => {
    saveTodos();
  }, [todos]);

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(todos)
      );
    } catch (e) {
      console.log("Failed to save todos", e);
    }
  };

  // ================= ADD / UPDATE TODO =================
  function handleTodo() {
    if (!description.trim()) return;

    const newTodo: TodoItem = {
      text: description.trim(),
      photo: photo,
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
  }

  // ================= OPTIONS =================
  function showTodoOptions(todo, index) {
    Alert.alert(
      'Todo Options',
      todo.text,
      [
        {
          text: 'Edit',
          onPress: () => {
            setDescription(todo.text);
            setPhoto(todo.photo || null);
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
      ]
    );
  }

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
              <View style={{ marginTop: 10 }} />
              <Button title="Take Photo" onPress={openCamera} />

              {photo && (
                <Image source={{ uri: photo }} style={styles.image} />
              )}

              <Button
                title={editIndex !== null ? "Update Todo" : "Add Todo"}
                onPress={handleTodo}
                style={{ marginTop: 10 }}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Your Todos</Text>

              {todos.length === 0 ? (
                <Text>No todos yet</Text>
              ) : (
                todos.map((todo, index) => (
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
                  </TouchableOpacity>
                ))
              )}
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

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

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

  todoItem: {
    fontSize: 16,
    marginTop: 10,
  },

  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },

  todoImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 5,
  },
});
