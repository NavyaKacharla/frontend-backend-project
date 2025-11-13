// server.js
const http = require("http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { URL } = require("url");

// MongoDB Atlas connection
const uri = "mongodb+srv://navyakacharla943:1231@cluster0.tih8xf0.mongodb.net/UserDB?retryWrites=true&w=majority";
const secret = "mySecretKey";

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const User = mongoose.model("User", userSchema);
const Item = mongoose.model("Item", itemSchema);

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // ---------------- REGISTER ----------------
  // 🔹 REGISTER ROUTE (Fixed)
if (req.url === "/register" && req.method === "POST") {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", async () => {
    try {
      const { name, email, password } = JSON.parse(body);

      // Validate all fields
      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }

      // Validate Gmail
      if (!email.endsWith("@gmail.com")) {
        throw new Error("Please use a valid Gmail address");
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Save all three fields correctly
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "Registered successfully" }));
    } catch (err) {
      console.error("❌ Registration error:", err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
  });
}

  // ---------------- LOGIN ----------------
// -------- LOGIN ----------
    // 🔹 LOGIN
else if (req.url === "/login" && req.method === "POST") {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", async () => {
    try {
      const { email, password } = JSON.parse(body);
      if (!email || !password) throw new Error("Missing email or password");

      // Gmail validation
      if (!email.endsWith("@gmail.com")) {
        throw new Error("Please use a valid Gmail address");
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      // Generate JWT
      const token = jwt.sign({ email }, secret, { expiresIn: "1h" });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Login successful",
          token,
          name: user.name,
        })
      );
    } catch (err) {
      console.error("❌ Login error:", err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Login failed",
          error: err.message,
        })
      );
    }
  });
}



  // ---------------- ADD ITEM ----------------
  else if (req.url === "/items" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        await Item.create(data);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Item added successfully" }));
      } catch (err) {
        console.error("❌ Add error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Failed to add item" }));
      }
    });
  }

  // ---------------- GET ITEMS ----------------
  else if (req.url === "/items" && req.method === "GET") {
    try {
      const items = await Item.find();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(items));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error fetching items" }));
    }
  }

  // ---------------- UPDATE ITEM ----------------
  else if (req.url.startsWith("/items") && req.method === "PUT") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id");
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const updatedData = JSON.parse(body);
        const updatedItem = await Item.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedItem) throw new Error("Item not found");

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Item updated successfully" }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Failed to update item" }));
      }
    });
  }

  // ---------------- DELETE ITEM ----------------
  else if (req.url.startsWith("/items") && req.method === "DELETE") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id");
    try {
      await Item.findByIdAndDelete(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Item deleted successfully" }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Failed to delete item" }));
    }
  }

  // ---------------- DEFAULT ----------------
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
