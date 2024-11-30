const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');
const auth = require('../middleware/auth');
const { sendEmail } = require('../utils/mailer');
const router = express.Router();

// Register a new user (admin or customer)
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, address, phone, role } = req.body;
    const user = new User({ username, password, email, firstName, lastName, address, phone, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000); // Convert expiry time to milliseconds

    const revokedToken = new RevokedToken({ token, expiresAt });
    await revokedToken.save();

    res.status(200).json({ message: 'Logout successful. Token has been revoked.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request password reset
router.post('/request-reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `http://yourfrontend.com/reset-password?token=${token}`;

    await sendEmail(user.email, 'Password Reset', `Please click the link to reset your password: ${resetLink}`);
    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
