const { OpenAI } = require('openai');
const jwt = require('jsonwebtoken');
const db = require("../routes/db-config");
const JWT_API = process.env.JWT_SECRET;
const OPENAI_API = process.env.OPENAI_API_KEY;

const openai =  new OpenAI({
    apiKey: OPENAI_API,
})

function extracttest(input) {
    const startKeyword = "Generate an advanced test with ";
    const endKeyword = " with answers and explanations. Return all the questions together";

    const startIndex = input.indexOf(startKeyword);
    const endIndex = input.indexOf(endKeyword);

    if (startIndex !== -1 && endIndex !== -1) {
        return input.substring(startIndex + startKeyword.length, endIndex).trim();
    }
    return input;
}

const test = async (req, res) => {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
        return res.status(400).json({status: "error", response: "Invalid user input" });
    }
    try {
        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: input }],
            model: "gpt-4-turbo",
            max_tokens: 2000,
        });
        const savedResponse = response.choices[0].message.content;
        const sentences = savedResponse.split('@#');

        const token = req.cookies['userRegistered'];
        if (token == null) {
            return res.sendStatus(401); // 没有token，返回401未授权
        }

        jwt.verify(token, JWT_API, (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // token无效，返回403禁止
            }

            // token有效，从decoded中获取用户ID
            const userId = decoded.id;
            const t = extracttest(input);
            const query = 'INSERT INTO test_history (user_id, topic, response, answer, explanation) VALUES (?, ?, ?, ?, ?)';
            db.query(query, [userId, t, sentences[0].trim(), sentences[1].trim(), sentences[2].trim()], (error, results) => {
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

module.exports = test;