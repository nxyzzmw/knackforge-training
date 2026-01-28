import React, { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { ScrollView } from 'react-native';
import { Button } from '@rneui/base';

export default function Todo() {
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // ADD or UPDATE TODO
  function handleTodo() {
    if (!description.trim()) return;

    if (editIndex !== null) {
      //  UPDATE
      const updatedTodos = [...todos];
      updatedTodos[editIndex] = description.trim();
      setTodos(updatedTodos);
      setEditIndex(null);
    } else {
      // ADD
      setTodos([...todos, description.trim()]);
    }

    setDescription('');
  }

  // ACTION SHEET
  function showTodoOptions(todo: string, index: number) {
    Alert.alert(
      'Todo Options',
      todo,
      [
        {
          text: 'Edit',
          onPress: () => {
            setDescription(todo);   // load text
            setEditIndex(index);    // mark editing
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTodos(todos.filter((_, i) => i !== index));
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View style={styles.container}>
            {/* INPUT CARD */}
            <View style={styles.card}>
              <Text style={styles.title}>Todo</Text>

              <TextInput
                placeholder="Write your todo here..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                style={styles.input}
              />

              <Button
                title={editIndex !== null ? 'Update Todo' : 'Add Todo'}
                style={styles.button}
                onPress={handleTodo}
              />
            </View>

            {/* TODO LIST */}
            <View style={styles.card}>
              <Text style={styles.title}>Your Todos</Text>

              {todos.length === 0 ? (
                <Text>No todos added yet.</Text>
              ) : (
                todos.map((todo, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => showTodoOptions(todo, index)}
                  >
                    <Text style={styles.todoItem}>• {todo}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
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
    textAlignVertical: 'top',
    marginTop: 10,
    width: '100%',
  },
  button: {
    width: 200,
    marginTop: 20,
    alignSelf: 'center',
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
    marginTop: 30,
  },
  todoItem: {
    marginTop: 10,
    fontSize: 16,
  },
});
