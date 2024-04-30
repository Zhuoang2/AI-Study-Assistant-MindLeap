const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./routes/db-config.js');
const app = express();
const cookie = require('cookie-parser');
app.use(bodyParser.json());
app.use(cors());
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookie());
app.use(express.json());
db.connect((err) => {
    if (err) throw err;
    console.log("MYSQL CONNECTED");
});
// const { OpenAI } = require('openai'); 
// const openai =  new OpenAI({
//     apiKey: "sk-proj-6SeKao6DwbNRzCo7c19TT3BlbkFJjj9QYkf0F5cWKHIjQIOT",
// })
// app.post('/chat', async (req, res) => {
//     const { prompt } = req.body;
//     try {
//         const response = await openai.chat.completions.create({
//             messages: [{ role: "user", content: prompt }],
//             model: "gpt-3.5-turbo",
//           }).then(response => {
//             res.send(response.choices[0].message.content);
//           }).catch(error => {
//             console.log(error);
//           });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// })
app.use('/', require('./routes/pages'));
app.use("/api", require("./controllers/auth"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});