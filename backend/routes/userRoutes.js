const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const authenticateUser = require('../middleware/authenticateUser');
require('dotenv').config();

// Login Route
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If the credentials are valid, generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    // Return the JWT token and user details
    res.status(200).json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





// Registration route
router.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ name, email, password: hashedPassword, userType });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Forgot password route
router.post('/api/forget-password', async (req, res) => {
  try {
    console.log('POST request to /api/reset-password');
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
    console.log(resetToken)

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'molbhao9969@gmail.com',
        pass: 'nrci tnwv ivdx uiuv',
      },
    });

    const mailOptions = {
      from: 'molbhao9969@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `Please click the following link to reset your password`,
      html: `
        <p>Please click the following link to reset your password:</p>
        <a href="${process.env.REACT_URL}/reset-password/${resetToken}">Reset Password</a>
      `,
    };



    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset password email:', error);
        return res.status(500).json({ message: 'Error sending reset password email' });
      } else {
        console.log('Reset password email sent:', info.response);
        return res.status(200).json({ message: 'Reset password email sent' });
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }


});


// Reset password route
router.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  console.log(token)
  try {
    console.log('POST request to /api/resetpass/:token');
    const { token } = req.params;
    const { newPassword } = req.body;
    console.log(token)

    // Find user by reset password token
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token' });
    }

    // Check if the token has expired
    if (user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





module.exports = router;
