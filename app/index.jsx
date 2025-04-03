import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter(); // Initialize the router
  const [username, setUsername] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const [buttonScale] = useState(new Animated.Value(1)); // Scale animation for the "Login" button
  const [loading, setLoading] = useState(false); // Loading state for the login button

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true); // Show loading state
    try {
      const response = await fetch("http://192.168.10.65:8081/api/login", { // Replace with your IP address
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Changed email to username
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging: Log the API response

      if (response.ok) {
        Alert.alert("Success", "Login successful!");
        console.log("Navigating to homescreen..."); // Debugging: Log navigation
        router.push("homescreen"); // Navigate to the home screen
      } else {
        Alert.alert("Error", data.message || "Invalid username or password."); // Updated error message
      }
    } catch (error) {
      console.error("Login Error:", error); // Debugging: Log the error
      Alert.alert("Error", "Unable to connect to the server.");
    } finally {
      setLoading(false); // Hide loading state
    }
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

  return (
    <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <BlurView intensity={50} tint="dark" style={styles.header}>
          <Text style={styles.headerTitle}>TODOS APPLICATION</Text>

        </BlurView>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username" // Changed placeholder from Email to Username
            placeholderTextColor="#BBB"
            value={username} // Changed from email to username
            onChangeText={setUsername} // Changed from setEmail to setUsername
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
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={loading} // Disable button while loading
            >
              <LinearGradient
                colors={["#3B82F6", "#2563EB"]}
                style={styles.loginButtonGradient}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Logging in..." : "Login"}
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text
            style={styles.footerLink}
            onPress={() => router.push("registerscreen")} // Navigate to the register screen
          >
            Sign Up
          </Text>
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

export function RegisterScreen() {
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
      const response = await fetch("http://192.168.10.65:8081/api/register", {
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

      if (response.ok) {
        Alert.alert("Success", "User registered successfully!", [
          {
            text: "OK",
            onPress: () => {
              console.log("Navigating to index..."); // Debugging: Log navigation
              router.push("index"); // Navigate to the login screen
            },
          },
        ]);
      } else {
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
            onPress={() => router.push("index")} // Navigate to the login screen
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
  safeContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(31, 41, 55, 0.8)",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  loginButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  loginButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  loginButtonText: {
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
  scrollContainer: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
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
});

