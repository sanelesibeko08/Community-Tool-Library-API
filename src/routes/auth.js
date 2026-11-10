const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const { members } = require('../data/store');
const { validationError } = require('../utils/errorResponse');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' ||
      email.trim() === '' || password === '') {
    const error = validationError('email and password are required');
    return res.status(error.status).json(error.body);
  }

  const member = members.find((candidate) => candidate.email === email);
  if (!member || !(await bcrypt.compare(password, member.passwordHash))) {
    return res.status(401).json({
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password'
    });
  }

  const token = jwt.sign(
    { sub: member.id },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
  return res.status(200).json({ data: { token } });
});

module.exports = router;
