import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!fullname.trim() || !username.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://192.168.10.63:8081/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: fullname.trim(),
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging: Log the API response
      console.log("Response Status:", response.status);
      console.log("Response OK:", response.ok);

      if (response.ok) {
        console.log("Registration successful, redirecting...");
        Alert.alert("Success", "User registered successfully!");
        router.push("/"); // Navigate to the login screen
      } else {
        console.log("Registration failed:", data.message);
        Alert.alert("Error", data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration Error:", error); // Debugging: Log the error
      Alert.alert("Error", "Unable to connect to the server.");
    }
  };

  return (
    <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#BBB"
          value={fullname}
          onChangeText={setFullname}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#BBB"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#BBB"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable onPress={handleRegister} style={styles.registerButton}>
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={styles.registerButtonGradient}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </LinearGradient>
        </Pressable>
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.footerLink}
            onPress={() => {
              console.log("Navigating to index..."); // Debugging: Log navigation
              router.push("/"); // Navigate to the login screen
            }}
          >
            Login
          </Text>
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 16,
    width: "100%",
  },
  registerButton: {
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  registerButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    color: "#9CA3AF",
  },
  footerLink: {
    color: "#3B82F6",
    fontWeight: "bold",
  },
});
