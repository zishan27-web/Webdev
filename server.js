const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

app.use(cors({ 
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
})); 
app.use(express.json()); 

app.use(express.static(path.join(__dirname)));

mongoose.connect("mongodb://127.0.0.1:27017/BloggingWebsite")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true }, 
    password: String,
    profession: String,
    birthdate: String,
    gender: String
});
const User = mongoose.model("User", userSchema);

// Blog Schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Technology', 'Science', 'Education', 'Arts', 'Other']
    },
    tags: [{
        type: String,
        trim: true
    }],
    coverImage: {
        type: String,  // URL to the image
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Blog = mongoose.model("Blog", blogSchema);

app.post("/SignUp", async (req, res) => {
    try {
        const { username, email, password, profession, birthdate, gender } = req.body;

        console.log("Received data:", { username, email, profession, birthdate, gender }); 

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required!" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with hashed password
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword, // Store the hashed password
            profession, 
            birthdate, 
            gender 
        });
        
        console.log("Attempting to save user:", { ...newUser.toObject(), password: '[HASHED]' });
        
        await newUser.save();

        console.log("User saved successfully:", { ...newUser.toObject(), password: '[HASHED]' }); 
        res.json({ message: "Signup successful!" });
    } catch (error) {
        console.error("Error saving user:", error); 
        if (error.code === 11000) { 
            res.status(400).json({ message: "Email already exists!" });
        } else {
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log("Login attempt for email:", email);
        
        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ message: "Email and password are required!" });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        console.log("User found:", user ? "Yes" : "No");
        
        // If user doesn't exist
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password valid:", isPasswordValid);
        
        if (!isPasswordValid) {
            console.log("Invalid password");
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        // User authenticated successfully
        console.log("Login successful for user:", user.email);
        res.status(200).json({ 
            success: true,
            message: "Login successful!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profession: user.profession
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});

// Create a new blog post
app.post("/api/blogs", async (req, res) => {
    try {
        const { title, content, category, tags, coverImage, userId, authorName } = req.body;

        // Validate required fields
        if (!title || !content || !category || !userId || !authorName) {
            return res.status(400).json({ 
                message: "Title, content, category, and author information are required!" 
            });
        }

        // Create new blog post
        const newBlog = new Blog({
            title,
            content,
            author: userId,
            authorName,
            category,
            tags: tags || [],
            coverImage: coverImage || null,
        });

        await newBlog.save();
        console.log("Blog saved successfully:", { id: newBlog._id, title });

        res.status(201).json({
            success: true,
            message: "Blog posted successfully!",
            blog: newBlog
        });

    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Error creating blog post" 
        });
    }
});

// Get all blogs
app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })  // Sort by newest first
            .limit(10);  // Limit to 10 posts per page

        res.json({
            success: true,
            blogs
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Error fetching blogs" 
        });
    }
});

// Get blogs by user
app.get("/api/blogs/user/:userId", async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.params.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            blogs
        });
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Error fetching user blogs" 
        });
    }
});

app.use((req, res) => {
    res.status(404).send("Page not found!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
