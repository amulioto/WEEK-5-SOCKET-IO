const express = require('express');
const router = express.Router();
const { registerUser, authenticateUser, generateToken } = require('../config/auth');

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = registerUser(username, password);
  const token = generateToken(user);
  res.json({ token });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = authenticateUser(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = generateToken(user);
  res.json({ token });
});

module.exports = router;