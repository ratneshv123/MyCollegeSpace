const express = require('express');
const router = express.Router();
const connection = require('../../db/db');


// const { resolve } = require('path');
// const { Buffer } = require('buffer');
// const bufferFrom = require('buffer-from');
//  const fs = require('fs');
// var path = require('path');


router.get('/gotimetable', async(req, res) => {
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

router.post('/watchthetimetable',async (req, res) => {
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

module.exports = router;