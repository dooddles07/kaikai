import React from "react";
import { View, Text, Pressable, StyleSheet, Animated, Image } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TodoItem({ item, toggleTodo, removeTodo, attachImage, openEditModal }) {
  return (
    <Animated.View
      style={[
        styles.todoItem,
        {
          opacity: item.fadeAnim,
          transform: [{ translateX: item.slideAnim }],
        },
      ]}
    >
      <Pressable
        style={styles.todoTextContainer}
        onPress={() => toggleTodo(item.id)}
      >
        <Text
          style={[
            styles.todoText,
            item.completed ? styles.completedText : styles.notCompletedText,
          ]}
        >
          {item.title}
        </Text>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.todoImage} />
        )}
      </Pressable>
      <View style={styles.todoActions}>
        {/* Complete Button */}
        <Pressable onPress={() => toggleTodo(item.id)} style={styles.completeButton}>
          <MaterialCommunityIcons
            name={item.completed ? "check-circle-outline" : "checkbox-blank-circle-outline"}
            size={20}
            color={item.completed ? "#22C55E" : "#3B82F6"}
          />
        </Pressable>

        {/* Edit Button */}
        <Pressable onPress={() => openEditModal(item)} style={styles.editButton}>
          <MaterialCommunityIcons name="pencil" size={20} color="#FACC15" />
        </Pressable>

        {/* Delete Button */}
        <Pressable onPress={() => removeTodo(item.id)}>
          <MaterialCommunityIcons name="delete-circle" size={24} color="#FF5252" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },
  notCompletedText: {
    color: "#FFFFFF",
  },
  todoImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  todoActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 10,
  },
  completeButton: {
    marginRight: 8,
  },
  editButton: {
    marginRight: 8,
  },
});