const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../db/db');

router.post('/viewinguseralldetails', authenticateToken,async (req, res) => {
    console.log(req.user_auth);
    const allUsers = await new Promise((resolve, reject)=> {
        const query = `SELECT email,name,cllgid FROM signup WHERE email=?`;
        connection.query(query,req.user_auth.email,(err, result)=>{
            if (err) reject(new Error('Something failed (Record Insertion) :' + err));
            resolve (result);
        });
    });
    console.log(allUsers);
    res.render('yourprofile',{user:allUsers});
})


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