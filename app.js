require('dotenv').config();
const express = require('express');
const authRouter = require('./routes/authRouter');
const workoutRouter = require('./routes/workoutRouter');
const mysql = require('./models/mysql');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/workout', workoutRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    mysql.query('delete from blackList');
    console.log(`app started on Port ${PORT}`);
});