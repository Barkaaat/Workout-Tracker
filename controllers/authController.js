const  mysql = require('../models/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register (req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('username and password are required');
    }

    try {
        const [rows] = await mysql.query('select * from users where username = ?', [username]);
        if (rows.length) {
            return res.status(409).send('username is already exist');
        }
    
        const hash = await bcrypt.hash(password, 10);
        await mysql.query('insert into users (username, password) values (?, ?)', [username, hash]);

        res.status(201).send('registration compeleted');
    } catch(err) {
        res.status(400).json({ Error: err.message });
    }
};

async function login (req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('username and password are required');
    }
    try {
        const [rows] = await mysql.query('select * from users where username = ?', [username]);
        if (!rows.length) {
            return res.status(404).send('user not found');
        }

        const hash = await bcrypt.compare(password, rows[0].password);
        if (!hash) {
            return res.status(401).send('wrong username or password');
        }
        
        const token = jwt.sign(
            { id: rows[0].id, username: username },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );
        console.log(token);
    
        res.status(200).json({ message: 'login successful', token: token });
    } catch(err) {
        res.status(400).json({ Error: err.message });
    }
};

async function logout(req, res) {
    try {
        console.log(req.token.length);
        await mysql.query('insert into blackList (token) values (?)', [req.token]);
        res.status(200).send('You logged out');
    } catch (err) {
        res.status(400).json({ Error: err.message });
    }
}

module.exports = {
    register,
    login,
    logout
};