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
  const router = useRouter(); // Initialize the router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonScale] = useState(new Animated.Value(1)); // Scale animation for the "Login" button

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Ensure this is correct
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Login successful!");
        router.push("home"); // Navigate to the home screen
      } else {
        Alert.alert("Error", data.message || "Invalid email or password.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to connect to the server.");
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
          <Text style={styles.headerSubtitle}>Login to continue</Text>
        </BlurView>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#BBB"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
            >
              <LinearGradient
                colors={["#3B82F6", "#2563EB"]}
                style={styles.loginButtonGradient}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.footerLink}>Sign Up</Text>
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
});

