import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { data } from "@/data/todos";

export default function Index() {
  const [todos, setTodos] = useState(data || []);
  const [text, setText] = useState("");

  const addTodo = useCallback(() => {
    if (!text.trim()) {
      Alert.alert("Error", "Task cannot be empty!");
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: text.trim(),
      completed: false,
      fadeAnim: new Animated.Value(0), // Start with opacity 0
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setText("");

    // Trigger animation to fade in the new task
    Animated.timing(newTodo.fadeAnim, {
      toValue: 1, // Fade to full opacity
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [text]);

  const toggleTodo = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const removeTodo = useCallback((id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        Animated.timing(todo.fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        });
      }
      return todo;
    });
    setTodos(updatedTodos);
  }, [todos]);

  const renderItem = useCallback(
    ({ item }) => (
      <TodoItem
        item={item}
        toggleTodo={toggleTodo}
        removeTodo={removeTodo}
      />
    ),
    [toggleTodo, removeTodo]
  );

  const completedTodos = todos.filter((todo) => todo.completed);
  const notCompletedTodos = todos.filter((todo) => !todo.completed);

  return (
    <LinearGradient colors={["#1B1B2F", "#162447"]} style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.navbar}>
          <Text style={styles.navbarTitle}>TODO LIST</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task"
            placeholderTextColor="#BBB"
            value={text}
            onChangeText={setText}
            returnKeyType="done"
            onSubmitEditing={addTodo}
          />
          <Pressable onPress={addTodo} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionHeader}>Not Completed</Text>
        <FlatList
          data={notCompletedTodos}
          renderItem={renderItem}
          keyExtractor={(todo) => todo.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
        <Text style={styles.sectionHeader}>Completed</Text>
        <FlatList
          data={completedTodos}
          renderItem={renderItem}
          keyExtractor={(todo) => todo.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const TodoItem = ({ item, toggleTodo, removeTodo }) => {
  if (!item.fadeAnim) item.fadeAnim = new Animated.Value(1);

  return (
    <Animated.View style={[styles.todoItem, { opacity: item.fadeAnim }]}>
      <Pressable style={styles.todoTextContainer} onPress={() => toggleTodo(item.id)}>
        <Text
          style={[
            styles.todoText,
            item.completed ? styles.completedText : styles.notCompletedText,
          ]}
        >
          {item.title}
        </Text>
      </Pressable>
      <View style={styles.todoActions}>
        <Text
          style={
            item.completed ? styles.completedLabel : styles.notCompletedLabel
          }
        >
          {item.completed ? "Completed" : "Not Completed"}
        </Text>
        <Pressable onPress={() => toggleTodo(item.id)} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {item.completed ? "Undo" : "Complete"}
          </Text>
        </Pressable>
        <Pressable onPress={() => removeTodo(item.id)}>
          <MaterialCommunityIcons name="delete-circle" size={32} color="#FF5252" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  safeContainer: {
    flex: 1,
    padding: 16,
  },
  navbar: {
    backgroundColor: "rgba(31, 41, 55, 0.8)",
    padding: 16,
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  navbarTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    flex: 1,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1,
    backgroundColor: "rgba(31, 41, 55, 0.8)",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#22C55E",
  },
  notCompletedText: {
    color: "#FACC15",
  },
  todoActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  completedLabel: {
    fontSize: 14,
    color: "#22C55E",
    fontWeight: "bold",
    marginRight: 8,
  },
  notCompletedLabel: {
    fontSize: 14,
    color: "#FACC15",
    fontWeight: "bold",
    marginRight: 8,
  },
  toggleButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  toggleButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 10,
    paddingHorizontal: 16,
  },
});