const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const saltRounds = 10;  

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) Validate input (simple check for non-empty fields)
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // 2) Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // Notify that the user already exists
      return res.status(409).json({ message: 'Username is already in use.' });
    }

    // 3) Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4) Save the new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Return the saved user (excluding the password)
    const { _id } = savedUser;
    return res.status(201).json({ message: 'User registered successfully', user: { _id, username } });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
 
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.json({ token });
    console.log("userid", user._id);

  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { register, login };
