const { OpenAI } = require('openai');
const jwt = require('jsonwebtoken');
const db = require("../routes/db-config");
const mysql = require('mysql');
const JWT_SECRET = process.env.JWT_SECRET;
const OPENAI_SECRET = process.env.OPENAI_API_KEY;

const openai =  new OpenAI({
    apiKey: OPENAI_SECRET,
})

function extractlearn(input) {
    const keyword = "explain ";
    const index = input.indexOf(keyword);
    if (index !== -1) {
        return input.substring(index + keyword.length);
    }
    return input;
}

const learn = async (req, res) => {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
        return res.status(400).json({status: "error", response: "Invalid user input" });
    }
    try {
        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: input }],
            model: "gpt-3.5-turbo",
            max_tokens: 2000,
        });
        const savedResponse = response.choices[0].message.content;
        const token = req.cookies['userRegistered'];
        if (token == null) {
            return res.sendStatus(401); // 没有token，返回401未授权
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // token无效，返回403禁止
            }
            // token有效，从decoded中获取用户ID
            const userId = decoded.id;
            const ques = extractlearn(input);
            const query = 'INSERT INTO learn_history (user_id, topic, response) VALUES (?, ?, ?)';
            db.query(query, [userId, ques, savedResponse], (error, results) => {
                if (error) {
                    console.error('Error saving to database:', error);
                    return res.status(500).json({ status: "success", response: savedResponse, history: "Failed to save to history" });
                }
            })
        });

        return res.json({status: "success", response: savedResponse, history: "Saved to history"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", response: error.message });
    }
}

module.exports = learn;