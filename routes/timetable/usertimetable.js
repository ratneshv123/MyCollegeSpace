const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../../db/db');


// const { resolve } = require('path');
// const { Buffer } = require('buffer');
// const bufferFrom = require('buffer-from');
//  const fs = require('fs');
// var path = require('path');


router.get('/gotimetable',authenticateToken, async(req, res) => {
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from timetable';
        connection.query(query, (err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        });
    });
    res.render('timetable',{users:alluser}); 
});

router.post('/timetable',(req, res) => {
    res.redirect('/gotimetable');
});

router.post('/watchthetimetable',authenticateToken, async (req, res) => {
    console.log(req.body);
    const user = {
        name: req.body.name,
        id:req.body.id
    }
    const data = [[user.name], [user.id]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from timetable where name=? AND id=?';
        connection.query(query,data,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('userviewingtimetable',{users:alluser});    
});

router.post('/movetimetable',authenticateToken, async(req, res) => {
    console.log(req.user_auth);
    console.log(req.body);
    var timetable = "timetable";
    var loc = 'public\\uploading\\timetable\\' + req.body.name + '.pdf';
    console.log(loc);
    user = { 
        typed:timetable,
        name: req.body.name,
        location:loc,
        semester: req.body.id,
        email:req.user_auth.email
    };
    console.log(user);
    new Promise((resolve, reject)=> {
            //console.log(this);
            const query = `INSERT INTO yourspace  SET ?`;
               connection.query(query, user, (err, result)=> {
                   if (err) reject(new Error('Something failed (Record Insertion) :' + err));
                    resolve (result);
                   });
    });
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from timetable';
        connection.query(query, (err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        });
    });
    res.render('timetable',{users:alluser}); 
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