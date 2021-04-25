const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../../db/db');

router.get('/routes/userbooks', authenticateToken, (req, res) => {
    console.log(req.user_auth);
    res.render('books'); 
});

router.post('/movebooks',authenticateToken, async(req, res) => {
    console.log(req.user_auth);
    console.log(req.body);
    var books = "books";
    var loc = 'public\\uploading\\books\\' + req.body.name + '.pdf';
    console.log(loc);
    user = { 
        typed:books,
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
    const allUsers = await new Promise((resolve, reject)=> {
        //console.log(this);
        const query = `SELECT * FROM books where presence=?`;
        
        connection.query(query,pre, (err, result)=>{
            if (err)    reject(new Error('Something failed (Record Insertion) :'+err));
            resolve (result);
        });
    });
    console.log(allUsers);
    res.render('books', {users: allUsers});
});

router.post('/availablebooks', (req, res) => {
    //  console.log(req.body);
    res.redirect('/routes/userbooks');
    // res.send('success');
});

router.get('/lookingpdf', async (req, res) => {
    var pre = 2;
    const allUsers = await new Promise((resolve, reject)=> {
        //console.log(this);
        const query = `SELECT * FROM books where presence=?`;
        
        connection.query(query,pre, (err, result)=>{
            if (err)    reject(new Error('Something failed (Record Insertion) :'+err));
            resolve (result);
        });
    });
    console.log(allUsers);
    res.render('books', {users: allUsers});
});



router.post('/lookbooks',authenticateToken, async(req, res) => {
    console.log(req.body);
    var pre = 2;
    const user = {
        id: req.body.semester,
        presence:pre
    }
    const data = [[user.id],[user.presence]];
    const alluser = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM books WHERE  id=? AND presence=?';
        connection.query(query, data, (err, result) => {
            if (err) reject(new Error("something is wrong here:" + err));
            resolve(result);
        });
    });
     res.render('books',{users:alluser});
});

router.post('/watchtheuserbook',authenticateToken,async(req, res) => {
    console.log(req.body);
    console.log('vishalharami');
    const user = {
        name: req.body.name,
        id:req.body.id
    }
    
    const data = [[user.name], [user.id]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from books where name=? AND id=?';
        connection.query(query,data,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('userviewingbook',{users:alluser}); 
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