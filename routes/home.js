const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    var message = "";
    res.render('home',{message:message});
});

router.get('/home', (req, res) => {
    var message = "";
    res.render('home',{message:message});
});

router.get('/homechle', (req, res) => {
    var message = "";
    res.render('home',{message:message});
});


module.exports = router;