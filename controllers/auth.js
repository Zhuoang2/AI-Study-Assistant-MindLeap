const express = require('express');
const register = require("./register");
const login = require("./login");
const learn = require("./learn");
const test = require("./test");
const user = require("./User");
const history = require("./history");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/learn", learn);
router.post("/test", test);
router.post("/User", user);
router.post("/history", history);

module.exports = router;
