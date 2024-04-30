const express = require('express');
const loggedIn = require('../controllers/loggedin');
const logout = require("../controllers/logout");
const router = express.Router();
const axios = require('axios');

router.get('/', loggedIn, (req, res) => {
    if (req.user) {
        res.render('index', {status: "loggedIn", user: req.user });
    } else {
        res.render('index', {status: "no", user: "nothing" });
    }
});

router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: "./public/js" });
});

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: "./public/js" });
});

router.get('/User', (req, res) => {
    res.sendFile('User.html', { root: "./public/js" });
});

router.get('/learn', (req, res) => {
    res.sendFile('learn.html', { root: "./public/js" });
});

router.get('/test', (req, res) => {
    res.sendFile('test.html', { root: "./public/js" });
});

router.get('/history', (req, res) => {
    res.sendFile('history.html', { root: "./public/js" });
});

router.get('/aboutbefore', (req, res) => {
    res.sendFile('aboutbefore.html', { root: "./public/js" });
});

router.get('/aboutafter', (req, res) => {
    res.sendFile('aboutafter.html', { root: "./public/js" });
});


router.get("/logout", logout);

module.exports = router;