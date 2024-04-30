const jwt = require('jsonwebtoken');
const db = require("../routes/db-config");
const mysql = require('mysql');
const JWT_SECRET = process.env.JWT_SECRET;

const history = async (req, res) => {
    const token = req.cookies['userRegistered'];
    if (token == null) {
      return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        const userId = decoded.id;

        // Perform the first query for learning history
        db.query('SELECT * FROM learn_history WHERE user_id = ?', [userId], (error, learning_result) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ status: 'error', message: 'MySQL server error' });
            }

            // Inside the callback of the first query, perform the second query for testing history
            db.query('SELECT * FROM test_history WHERE user_id = ?', [userId], (error, testing_result) => {
                if (error) {
                    console.error('Database query error:', error);
                    return res.status(500).json({ status: 'error', message: 'MySQL server error' });
                }

                if (learning_result.length > 0 && testing_result.length > 0) {
                    return res.status(200).json({ status: 'success', learning: learning_result, testing: testing_result });
                } else if (learning_result.length > 0) {
                    return res.status(200).json({ status: 'success', learning: learning_result, testing: [] });
                } else if (testing_result.length > 0) {
                    return res.status(200).json({ status: 'success', learning: [], testing: testing_result });
                } else {
                    return res.status(404).json({ status: 'error', message: 'No history found' });
                }
            });
        });
    });
};

module.exports = history;