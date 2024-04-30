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
app.use('/', require('./routes/pages'));
app.use("/api", require("./controllers/auth"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});