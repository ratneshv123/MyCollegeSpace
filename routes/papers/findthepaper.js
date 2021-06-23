const express = require('express');
const router = express.Router();
const connection = require('../../db/db');
const jwt = require('jsonwebtoken');
const { route } = require('./userpapers');

router.post('/findpaper',authenticateToken, async (req, res) => {
  
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
    
  
    console.log(allUsers);
    
    console.log(data[0]);
    
        res.render('papers', { users: allUsers });
});


router.post('/movepaper', authenticateToken, async(req, res) => {
    console.log(req.user_auth);
    console.log(req.body);
    var paper = "paper";
    var loc = 'public\\uploading\\mcapapers\\' + req.body.name + '.pdf';
    console.log(loc);
    user = { 
        typed:paper,
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
    var pre = 2;
    const user1 = {
        id: req.body.id,
        presence:pre
    }
    const data = [[user1.id],[user1.presence]];
    const allUsers = await new Promise((resolve, reject)=> {
        //console.log(this);
        const query = `SELECT * FROM mcapapers where id=? AND presence=?`;
        
        connection.query(query,data,(err, result)=>{
            if (err) reject(new Error('Something failed (Record Insertion) :' + err));
            resolve (result);
        });
    });    
        res.render('papers', { users: allUsers });
});
  
router.post('/watchtheuserpaper',authenticateToken, async(req, res) => {
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