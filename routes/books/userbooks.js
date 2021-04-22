const express = require('express');
const router = express.Router();
const connection = require('../../db/db');
router.get('/routes/userbooks', (req, res) => {
    res.render('books'); 
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



router.post('/lookbooks', async(req, res) => {
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

router.post('/watchtheuserbook',async(req, res) => {
    console.log(req.body);
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

module.exports = router;