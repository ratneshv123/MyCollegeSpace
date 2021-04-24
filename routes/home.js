const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    // res.clearCookie('jwt');
    var message = "";
    res.render('home',{message:message});
});

router.get('/home', (req, res) => {
    // res.clearCookie('jwt');
    var message = "";
    res.render('home',{message:message});
});

router.get('/homechle', (req, res) => {
    res.clearCookie('jwt');
    var message = "";
    res.render('home',{message:message});
});

function authenticateToken(req, res, next) {
    console.log(req.cookies);
    const token = req.cookies.auth_token;
    if (token) {
        // const token = req.cookies.auth_token;
        const user_auth = jwt.verify(token, process.env.SECRET_KEY || "UNSECURED_JWT_PRIVATE_TOKEN");
        // console.log('hewe');
        // console.log(user_auth);
        // console.log('hewe');
    //    const user= jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    //         // const id = payload.id;
    //         const user = {
    //             email: payload.email
    //         }
            req.user_auth = user_auth;
            next();   
    //     });   
    }
    else {
        res.redirect('/');
    }
}

module.exports = router;