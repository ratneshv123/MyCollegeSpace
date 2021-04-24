const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/routes/papers',authenticateToken, (req, res) => {
    res.render('papers'); 
});

router.post('/papersuser', (req, res) => {
   // console.log(req.body); 
    res.redirect('/routes/papers');
});

function authenticateToken(req, res, next) {
    console.log(req.cookies);
    const token = req.cookies.auth_token;
    if (token) {
        // const token = req.cookies.auth_token;
        const  user_auth  = jwt.verify(token, process.env.SECRET_KEY || "UNSECURED_JWT_PRIVATE_TOKEN");
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