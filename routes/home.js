const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.clearCookie('auth_token');
    var message = "";
    res.render('home',{message:message});
});

router.get('/home',authenticateToken, (req, res) => {
    res.clearCookie('auth_token');
    var message = "";
    res.render('home',{message:message});
});

router.get('/homechle',authenticateToken, (req, res) => {
    res.clearCookie('auth_token');
    var message = "";
    res.render('home',{message:message});
});

function authenticateToken(req, res, next) {
    console.log(req.cookies);
try {
        const token = req.cookies.auth_token;
        if (token)
        {
            const  user_auth  = jwt.verify(token, process.env.SECRET_KEY || "UNSECURED_JWT_PRIVATE_TOKEN");
            req.user_auth = user_auth; 
            next();   
    } else
        {
            res.redirect('/');
        }    
    }
    catch (error) {
            res.redirect('/');
    }
}

module.exports = router;