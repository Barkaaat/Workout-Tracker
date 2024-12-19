const jwt = require('jsonwebtoken');
const mysql = require('../models/mysql');

async function authToken(req, res, next) {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access token required');
    }

    const [rows] = await mysql.query('select * from blackList where token = ?', [token]);
    if (rows.length) {
        return res.status(401).send('You logged out');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid or expired token');
        }
 
        req.user = user;
        next();
    });
};

module.exports = {
    authToken
}