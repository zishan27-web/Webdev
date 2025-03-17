
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://127.0.0.1:5500" })); 
app.use(express.json()); 

app.use(express.static(path.join(__dirname)));

mongoose.connect("mongodb://127.0.0.1:27017/signupDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true }, // Ensure emails are unique
    password: String,
    profession: String,
    birthdate: String,
    gender: String
});
const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password, profession, birthdate, gender } = req.body;

        console.log("Received data:", { username, email, password, profession, birthdate, gender }); // Log received data

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Create a new user
        const newUser = new User({ username, email, password, profession, birthdate, gender });
        await newUser.save();

        console.log("User saved successfully:", newUser); // Log saved user
        res.json({ message: "Signup successful!" });
    } catch (error) {
        console.error("Error saving user:", error); // Log the full error
        if (error.code === 11000) { // MongoDB duplicate key error
            res.status(400).json({ message: "Email already exists!" });
        } else {
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).send("Page not found!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});