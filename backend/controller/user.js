const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Use a fallback secret key for dev/testing (ensure it's set in production)
const SECRET = process.env.SECRET_KEY || "dev_secret_key";

// 🧑‍💻 User Signup
const userSignUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ email, id: newUser._id }, SECRET, { expiresIn: "1d" });

    return res.status(200).json({ token, user: newUser });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ error: "Internal server error during signup." });
  }
};

// 🔐 User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    const isPasswordValid = user && await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ email, id: user._id }, SECRET, { expiresIn: "1d" });

    return res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Internal server error during login." });
  }
};

// 📩 Get User by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("email");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("GetUser Error:", err);
    return res.status(500).json({ error: "Internal server error fetching user." });
  }
};

module.exports = {
  userSignUp,
  userLogin,
  getUser,
};
