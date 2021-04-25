const express = require('express');
const router = express.Router();
const multer = require("multer");
const jwt = require('jsonwebtoken');
const fs = require('fs');
var path = require('path');
const connection = require('../../../../db/db');

//idhr se shuru hai 

router.get('/updelnotes',authenticateToken, (req, res) => {
    res.render('updateanddeletenotes'); 
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploading/notes");
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});


var upload = multer({
    storage: storage,
}).single('file');

router.post("/upnotes",authenticateToken, (req, res) => {
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
            const query = `INSERT INTO notes SET ?`;
               connection.query(query, user, (err, result)=> {
                   if (err) reject(new Error('Something failed (Record Insertion) :' + err));
                    resolve (result);
                   });
               }); 
  })
    res.redirect('/updelnotes');
});


// watching the semester wise books route is below here 

router.post('/watchnotes',authenticateToken, async(req, res) => {
    console.log(req.body);
    var pre = 2;
    const user = {
        id: req.body.semester,
        presence:pre
    }
    const data = [[user.id],[user.presence]];
    const alluser = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM notes WHERE  id=? AND presence=?';
        connection.query(query, data, (err, result) => {
            if (err) reject(new Error("something is wrong here:" + err));
            resolve(result);
        });
    });
     res.render('updateanddeletenotes',{users:alluser});
});



// deleting the books of particular semester

router.post('/deletethisnote',authenticateToken, async(req, res) => {
    console.log(req.body);
    var pre = 2;
    const user = {
        name: req.body.delnotesname,
        id: req.body.delnotesid,
        presence:pre
    }

    var filePath = 'G:/MyCollegeSpace/public/uploading/notes/'+user.name+'.pdf'; 
    fs.unlinkSync(filePath);
 
    const data = [[user.name],[user.id],[user.presence]];
    await new Promise((resolve, reject) => {
        const query = `DELETE FROM notes WHERE name=? AND id=? AND presence=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });

    const tempouser = {
        id: req.body.delnotesid,
        presence:pre
    }
    const datatemp = [[tempouser.id],[tempouser.presence]];
   const alluser= await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM  notes WHERE id=? AND presence=?';
        connection.query(query, datatemp, (err, result) => {
            if (err) reject(new Error('something failed:' + err));
            resolve(result);
        });
    });
    res.render('updateanddeletenotes',{users:alluser});
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
            res.redirect('/adminloginpanel');
        }    
    }
    catch (error) { 
            res.redirect('/adminloginpanel');
    }
}


module.exports = router;