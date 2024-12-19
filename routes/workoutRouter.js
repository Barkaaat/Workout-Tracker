const express = require('express');
const jwt = require('jsonwebtoken');
const { authToken } = require('../services/authService');
const { getPlan, addWorkout, deleteWorkout, addCommentsToWorkout } = require('../controllers/workoutController');

const router = express.Router();

router.get('/plan', authToken, getPlan);
router.post('/add', authToken, addWorkout);
router.delete('/delete', authToken, deleteWorkout);
router.post('/addComment', authToken, addCommentsToWorkout);

module.exports = router;