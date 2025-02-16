const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const saltRounds = 10;  

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ message: 'Server error' });
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
