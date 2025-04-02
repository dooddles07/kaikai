import React, { useReducer, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import TodoItem from "./components/TodoItem"; // Reusable component

// Initial state for todos
const initialState = [];

// Reducer function for managing todos
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [action.payload, ...state];
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "ATTACH_IMAGE":
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, image: action.payload.image } : todo
      );
    default:
      return state;
  }
}

export default function Index() {
  const [todos, dispatch] = useReducer(todoReducer, initialState);
  const [text, setText] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  // Add a new todo
  const addTodo = () => {
    if (!text.trim()) {
      Alert.alert("Error", "Task cannot be empty!");
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: text.trim(),
      completed: false,
      createdAt: new Date(),
      image: null, // Placeholder for the attached image
    };

    dispatch({ type: "ADD_TODO", payload: newTodo });
    setText("");
  };

  // Attach an image to a todo
  const attachImage = async (id) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to allow access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      dispatch({
        type: "ATTACH_IMAGE",
        payload: { id, image: result.assets[0].uri },
      });
    }
  };

  // Open edit modal
  const openEditModal = (todo) => {
    setEditTodo(todo);
    setEditModalVisible(true);
  };

  // Save edited todo
  const saveEditTodo = () => {
    if (!editTodo.title.trim()) {
      Alert.alert("Error", "Task cannot be empty!");
      return;
    }

    dispatch({
      type: "ADD_TODO",
      payload: { ...editTodo, title: editTodo.title },
    });
    setEditModalVisible(false);
    setEditTodo(null);
  };

  // Separate completed and not completed tasks
  const completedTodos = todos.filter((todo) => todo.completed);
  const notCompletedTodos = todos.filter((todo) => !todo.completed);

  const renderItem = ({ item }) => (
    <TodoItem
      item={item}
      toggleTodo={(id) => dispatch({ type: "TOGGLE_TODO", payload: id })}
      removeTodo={(id) => dispatch({ type: "REMOVE_TODO", payload: id })}
      attachImage={attachImage}
      openEditModal={openEditModal}
    />
  );

  return (
    <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
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
          <Pressable onPress={addTodo} style={styles.addButton}>
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </LinearGradient>
          </Pressable>
        </View>
        {todos.length === 0 ? (
          <View style={styles.emptyListContainer}>
            <MaterialCommunityIcons
              name="playlist-remove"
              size={64}
              color="#6B7280"
            />
            <Text style={styles.emptyListText}>Your todo list is empty!</Text>
          </View>
        ) : (
          <>
            {/* Not Completed Tasks */}
            <Text style={styles.sectionHeader}>Not Completed</Text>
            <FlatList
              data={notCompletedTodos}
              renderItem={renderItem}
              keyExtractor={(todo) => todo.id.toString()}
              contentContainerStyle={styles.listContainer}
            />

            {/* Completed Tasks */}
            <Text style={styles.sectionHeader}>Completed</Text>
            <FlatList
              data={completedTodos}
              renderItem={renderItem}
              keyExtractor={(todo) => todo.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}

        {/* Edit Modal */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Task</Text>
              <TextInput
                style={styles.input}
                placeholder="Edit task title"
                placeholderTextColor="#BBB"
                value={editTodo?.title}
                onChangeText={(text) =>
                  setEditTodo((prev) => ({ ...prev, title: text }))
                }
              />
              <View style={styles.modalActions}>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={saveEditTodo}>
                  <Text style={styles.modalButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    marginTop: 20,
  },
});
