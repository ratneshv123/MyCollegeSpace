const express = require('express');
const router = express.Router();
const connection = require('../../db/db');
const { route } = require('./userpapers');

router.post('/findpaper', async (req, res) => {
    console.log('chlo');
    console.log(req.body);
    
    var pre = 2;
    const user = {
        id: req.body.Ipaper,
        presence:pre
    }
    const data = [[user.id],[user.presence]];
    
    const allUsers = await new Promise((resolve, reject)=> {
        //console.log(this);
        const query = `SELECT * FROM mcapapers where id=? AND presence=?`;
        
        connection.query(query,data,(err, result)=>{
            if (err) reject(new Error('Something failed (Record Insertion) :' + err));
            resolve (result);
        });
    });
    
    console.log('jaskfjasdfla');
    console.log(allUsers);
    console.log('jaskfjasdfla');
    console.log(data[0]);
    
        res.render('papers', { users: allUsers });
});

router.post('/watchtheuserpaper', async(req, res) => {
    console.log(req.body);
    const user = {
        name: req.body.name,
        id:req.body.id
    }
    const data = [[user.name], [user.id]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from mcapapers where name=? AND id=?';
        connection.query(query,data,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('userviewingpaper',{users:alluser});
});

module.exports = router;