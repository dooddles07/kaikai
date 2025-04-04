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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router"; // Import useRouter
import AsyncStorage from "@react-native-async-storage/async-storage";

const saveTasks = async (type_id, tasks) => {
  try {
    await AsyncStorage.setItem(`tasks_${type_id}`, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

const loadTasks = async (type_id) => {
  try {
    const storedTasks = await AsyncStorage.getItem(`tasks_${type_id}`);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

export default function HomeScreen({ userId, username }) {
  const router = useRouter(); // Initialize the router

  console.log("Username:", username); // Debugging: Check if username is passed

  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [buttonScale] = useState(new Animated.Value(1)); // Scale animation for the "Add" button

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
      slideAnim: new Animated.Value(300), // Start off-screen (right)
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setText("");

    // Trigger animation to fade in and slide in the new task
    Animated.parallel([
      Animated.timing(newTodo.fadeAnim, {
        toValue: 1, // Fade to full opacity
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(newTodo.slideAnim, {
        toValue: 0, // Slide to its position
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [text]);

  const toggleTodo = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          const bounceAnim = new Animated.Value(1);
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1.2,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          return {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toLocaleString() : null, // Set or clear the completedAt property
            bounceAnim,
          };
        }
        return todo;
      })
    );
  }, []);

  const removeTodo = useCallback((id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        Animated.parallel([
          Animated.timing(todo.fadeAnim, {
            toValue: 0, // Fade out
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(todo.slideAnim, {
            toValue: -300, // Slide off-screen (left)
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        });
      }
      return todo;
    });
    setTodos(updatedTodos);
  }, [todos]);

  const openEditModal = (todo) => {
    setEditTodo(todo);
    setEditModalVisible(true);
  };

  const saveEditTodo = () => {
    if (!editTodo.title.trim()) {
      Alert.alert("Error", "Task cannot be empty!");
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === editTodo.id ? { ...todo, title: editTodo.title } : todo
      )
    );
    setEditModalVisible(false);
    setEditTodo(null);
  };

  const handleButtonPressIn = () => {
    Animated.timing(buttonScale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.timing(buttonScale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = () => {
    router.push("/"); // Navigate to the index screen
  };

  const renderItem = useCallback(
    ({ item }) => (
      <TodoItem
        item={item}
        toggleTodo={toggleTodo}
        removeTodo={removeTodo}
        openEditModal={openEditModal}
      />
    ),
    [toggleTodo, removeTodo, openEditModal]
  );

  const completedTodos = todos.filter((todo) => todo.completed);
  const notCompletedTodos = todos.filter((todo) => !todo.completed);

  return (
    <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Display the username */}
        <Text style={styles.usernameLabel}>Welcome, { username }!</Text>

        <BlurView intensity={50} tint="dark" style={styles.navbar}>
          <Text style={styles.navbarTitle}>TODO LIST</Text>
        </BlurView>
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
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              onPress={addTodo}
              style={styles.addButton}
            >
              <LinearGradient
                colors={["#3B82F6", "#2563EB"]}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
        {notCompletedTodos.length === 0 && completedTodos.length === 0 ? (
          <EmptyList />
        ) : (
          <>
            <Section title="Not Completed">
              <FlatList
                data={notCompletedTodos}
                renderItem={renderItem}
                keyExtractor={(todo) => todo.id.toString()}
                contentContainerStyle={styles.listContainer}
              />
            </Section>
            <Section title="Completed">
              <FlatList
                data={completedTodos}
                renderItem={renderItem}
                keyExtractor={(todo) => todo.id.toString()}
                contentContainerStyle={styles.listContainer}
              />
            </Section>
          </>
        )}

        <EditModal
          visible={editModalVisible}
          editTodo={editTodo}
          setEditTodo={setEditTodo}
          onClose={() => setEditModalVisible(false)}
          onSave={saveEditTodo}
        />

        {/* Logout Button */}
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const TodoItem = ({ item, toggleTodo, removeTodo, openEditModal }) => {
  if (!item.fadeAnim) item.fadeAnim = new Animated.Value(1);
  if (!item.slideAnim) item.slideAnim = new Animated.Value(0);
  if (!item.bounceAnim) item.bounceAnim = new Animated.Value(1);

  return (
    <Animated.View
      style={[
        styles.todoItem,
        {
          opacity: item.fadeAnim,
          transform: [
            { translateX: item.slideAnim },
            { scale: item.bounceAnim || 1 },
          ],
        },
      ]}
    >
      <View style={styles.todoTextContainer}>
        <Text
          style={[
            styles.todoText,
            item.completed ? styles.completedTextNoLine : styles.notCompletedText,
          ]}
        >
          {item.title}
        </Text>
      </View>
      <View style={styles.todoActions}>
        {/* Render the Edit button only if the task is not completed */}
        {!item.completed && (
          <Pressable onPress={() => openEditModal(item)} style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={24} color="#3B82F6" />
          </Pressable>
        )}
        {/* Render a static checkmark for completed tasks */}
        {item.completed ? (
          <MaterialCommunityIcons name="check-circle" size={32} color="#22C55E" />
        ) : (
          <Pressable onPress={() => toggleTodo(item.id)} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>✔</Text>
          </Pressable>
        )}
        {/* Render the Delete button only if the task is not completed */}
        {!item.completed && (
          <Pressable onPress={() => removeTodo(item.id)}>
            <MaterialCommunityIcons name="delete-circle" size={32} color="#FF5252" />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
};

const Section = ({ title, children }) => (
  <>
    <Text style={styles.sectionHeader}>{title}</Text>
    {children}
  </>
);

const EmptyList = () => (
  <View style={styles.emptyListContainer}>
    <MaterialCommunityIcons name="playlist-remove" size={64} color="#6B7280" />
    <Text style={styles.emptyListText}>Your todo list is empty!</Text>
  </View>
);

const EditModal = ({ visible, editTodo, setEditTodo, onClose, onSave }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit Task</Text>
        <TextInput
          style={styles.editInput}
          placeholder="Edit task title"
          placeholderTextColor="#BBB"
          value={editTodo?.title}
          onChangeText={(text) =>
            setEditTodo((prev) => ({ ...prev, title: text }))
          }
        />
        <View style={styles.modalActions}>
          <Pressable style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.modalButton} onPress={onSave}>
            <Text style={styles.modalButtonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

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
    borderRadius: 8,
    overflow: "hidden",
  },
  addButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
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
  completedTextNoLine: {
    color: "#22C55E", // Green color for completed tasks
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
  toggleButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  toggleButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  emptyListContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
  },
  editButton: {
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  editInput: {
    width: "100%", // Make the input take the full width of the modal
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16, // Increase padding for better usability
    fontSize: 18, // Increase font size for better readability
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Match the modal's background
    marginBottom: 16, // Add spacing below the input
  },
  disabledButton: {
    opacity: 0, // Reduce opacity to indicate the button is disabled
  },
  logoutButton: {
    position: "absolute",
    bottom: 16, // Move to the bottom of the screen
    right: 16, // Align to the right
    backgroundColor: "#FF5252",
    paddingVertical: 6, // Smaller padding
    paddingHorizontal: 12, // Smaller padding
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 12, // Smaller font size
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  usernameLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8, // Add spacing below the username
  },
});