const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json()); // Ensure JSON body parsing middleware is enabled

// In-memory storage for registered users
const users = [];
let nextTypeId = 1; // Counter for generating type_id

// Login Endpoint
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Find user in the database
  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
    console.log("Login successful for user:", username);
    res.status(200).json({
      message: "Login successful!",
      username: user.username,
      type_id: user.type_id,
    });
  } else {
    console.log("Invalid login attempt for username:", username);
    res.status(401).json({ message: "Invalid username or password." });
  }
});

// Register Endpoint
app.post("/api/auth/register", (req, res) => {
  const { fullname, username, password, type_id } = req.body;

  // Validate input
  if (!fullname || !username || !password || !type_id) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if the username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    console.log("Registration failed: Username already exists:", username);
    return res.status(409).json({ message: "Username already exists." });
  }

  // Add user with provided type_id
  users.push({ fullname, username, password, type_id });

  console.log("New User Registered:", { fullname, username, password, type_id });
  console.log("Current Users:", users); // Log all users for debugging

  res.status(201).json({ message: "User registered successfully!", type_id });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});