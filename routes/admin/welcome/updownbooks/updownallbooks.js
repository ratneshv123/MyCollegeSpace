const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
var path = require('path');
const connection = require('../../../../db/db');



router.post('/updelbooks', (req,res) => {
    res.render('updateanddeletebooks');
});

router.get('/uploadsuccessbooks', (req, res) => {
    res.render('updateanddeletebooks'); 
});

//idhr se shuru hai 

router.get('/gotobooks', (req, res) => {
    res.render('updateanddeletebooks'); 
});

router.get('/gotouserrequest', (req, res) => {
    res.render('updateanddeleteuserrequest'); 
});


router.get('/gotowelcome', (req, res) => {
    res.render('welcomeadmin'); 
});

router.get('/gototimetable',async(req, res) => {
    const alluser = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM timetable';
        connection.query(query, (err, result) => {
            if (err) reject(new Error('something is wrong:' + err));
            resolve(result);
        });
    });
    res.render('updateanddeletetimetable',{users:alluser}); 
});



router.get('/gotopapers', (req, res) => {
    res.render('updateanddeletepapers'); 
});

router.get('/gotonotes', (req, res) => {
    res.render('updateanddeletenotes'); 
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploading/books");
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});


var upload = multer({
  storage: storage,
}).single('file');

router.post("/upbooks", (req, res) => {
    console.log(req.body);
    let user;
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.send(err)
    } else if (err) {
      // An unknown error occurred when uploading.
        res.send(err);
    } else
    {
     // res.redirect('/buysuccess');
    }
     // console.log(req.file);
      var pre = 2;
       user = { 
       name: req.file.originalname,
       place: req.file.path,
       id:req.body.paperid,
       type: req.file.mimetype,
           size: req.file.size,
       presence:pre
     };
     console.log(user);
        var str = user.name;
        // console.log(str.length-4);
        // console.log(str.substr(0, str.length - 4));
        user.name = str.substr(0, str.length - 4);
        console.log(user.name); 
      //database work-> store the user
       new Promise((resolve, reject)=> {
            //console.log(this);
            const query = `INSERT INTO books SET ?`;
               connection.query(query, user, (err, result)=> {
                   if (err) reject(new Error('Something failed (Record Insertion) :' + err));
                    resolve (result);
                   });
               }); 
  })
    res.redirect('/uploadsuccessbooks');
});


// watching the semester wise books route is below here 

router.post('/watchbooks', async(req, res) => {
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
     res.render('updateanddeletebooks',{users:alluser});
});



// deleting the books of particular semester

router.post('/deletethisbook', async(req, res) => {
    console.log(req.body);

    console.log('hell');    
    var pre = 2;
    const user = {
        name: req.body.delbookname,
        id: req.body.delbookid,
        presence:pre
    }

    var filePath = 'G:/collegespace/public/uploading/books/'+user.name+'.pdf'; 
    fs.unlinkSync(filePath);
 
    const data = [[user.name], [user.id], [user.presence]];
    console.log(data);
    await new Promise((resolve, reject) => {
        const query = `DELETE FROM books WHERE name=? AND id=? AND presence=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });

    const tempouser = {   
        id: req.body.delbookid,
        presence:pre
    }
    const datatemp = [[tempouser.id],[tempouser.presence]];
   const alluser= await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM  books WHERE id=? AND presence=?';
        connection.query(query, datatemp, (err, result) => {
            if (err) reject(new Error('something failed:' + err));
            resolve(result);
        });
    });
    res.render('updateanddeletebooks',{users:alluser});
});



module.exports = router;