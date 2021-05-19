const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
var path = require('path');
const jwt = require('jsonwebtoken');
const connection = require('../../db/db');

router.get('/gotomyrequests', authenticateToken, (req, res) => {
    var message = "";
    res.render('myrequests',{message:message}); 
});

router.post('/makerequest', (req, res) => {
    res.redirect('/gotomyrequests');
});



  
  
 
  
router.post("/upuserpapers",authenticateToken, (req, res) => {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "public/uploading/mcapapers");
        },
        filename: function (req, file, cb) {
          cb(null,file.originalname);
        },
    });
    var upload = multer({
        storage: storage,
    }).single('file');
    

      var cor = "papers";
      var pre = 1;
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
         user = { 
         name: req.file.originalname,
         place: req.file.path,
         id:req.body.paperid,
         type: req.file.mimetype,
         size: req.file.size,
         presence:pre
       };
       var str = user.name;
     user.name = str.substr(0, str.length - 4);
        console.log(user.name);
        console.log(user);
        
        //database work-> store the user
         new Promise((resolve, reject)=> {
              //console.log(this);
              const query = `INSERT INTO mcapapers SET ?`;
                 connection.query(query, user, (err, result)=> {
                     if (err) reject(new Error('Something failed (Record Insertion) :' + err));
                      resolve (result);
                     });
                 }); 
    })
    var message = "Your Request is Registered";
    res.render('myrequests',{message:message}); 
  });


router.post("/upusernotes",authenticateToken, (req, res) => {
      
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
    


      var cor = "notes";
      var pre = 1;
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
       user = { 
       name: req.file.originalname,
       place: req.file.path,
       id:req.body.paperid,
       type: req.file.mimetype,
       size:req.file.size,
       presence:pre
     };
     var str = user.name;
      user.name = str.substr(0, str.length - 4);
     console.log('heshe');
     console.log(user.name);
     console.log('heshe');
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
  var message = "Your Request is Registered";
  res.render('myrequests',{message:message});
  });


router.post("/upuserbooks",authenticateToken, (req, res) => {
      
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
    


      var cor = "books";
      var pre = 1;
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
       user = { 
       name: req.file.originalname,
       place: req.file.path,
       id:req.body.paperid,
       type: req.file.mimetype,
       size:req.file.size,
       presence:pre
     };
      var str = user.name;
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
  var message = "Your Request is Registered";
  res.render('myrequests',{message:message});
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