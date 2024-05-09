import express from "express";
import User from "../models/User.js";
const router = express.Router();
import { generateToken, jwtAuth } from "../middlewares/auth.js";
import bcrypt from "bcrypt";

//getting the all user
router.get("/api/signup", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal error" });
  }
});

//creating the user
router.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Unable to sign up: Name, email, and password are required",
      });
    }
    const user = await new User({ name, email, password });
    await user.save();
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const token = generateToken(payload);
    res.status(200).send({ message: "User created successfully", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal error" });
  }
});
router.put("/api/update/:id", jwtAuth, async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.id;
  try {
    if (!name || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res
      .status(200)
      .send({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal error" });
  }
});

//login the user
router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password 😞" });
    }
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const token = generateToken(payload);

    res.status(200).send({ message: "User logged in successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});
router.post("/api/logout", (req, res) => {
  localStorage.removeItem("token");
  res.status(200).json({ message: "Logout successful" });
});

export default router;
