import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonScale] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://devapi-618v.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        Alert.alert("Success", "Login successful!");
        console.log("Navigating to homescreen...");
        router.push("homescreen");
      } else {
        Alert.alert("Error", data.message || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Unable to connect to the server.");
    } finally {
      setLoading(false);
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
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={loading}
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
            onPress={() => router.push("registerscreen")}
          >
            Sign Up
          </Text>
        </Text>
      </SafeAreaView>
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
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", // Replace shadow* properties with boxShadow
    elevation: 5, // Keep elevation for Android compatibility
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
});

