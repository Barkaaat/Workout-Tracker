const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { authToken } = require('../services/authService');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', authToken, logout);

module.exports = router;