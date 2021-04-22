const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
var path = require('path');
const connection = require('../../db/db');

router.get('/gotomyrequests', (req, res) => {
    res.render('myrequests'); 
});

router.post('/makerequest', (req, res) => {
    res.redirect('/gotomyrequests');
});



  
  
 
  
router.post("/upuserpapers", (req, res) => {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "public/uploading/mcapapers");
        },
        filename: function (req, file, cb) {
          cb(null,file.originalname + path.extname(file.originalname));
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
      res.redirect('/gotomyrequests');
  });


router.post("/upusernotes", (req, res) => {
      
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "public/uploading/notes");
        },
        filename: function (req, file, cb) {
          cb(null,file.originalname + path.extname(file.originalname));
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
     console.log(user);
      
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
    res.redirect('/gotomyrequests');
  });


router.post("/upuserbooks", (req, res) => {
      
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "public/uploading/books");
        },
        filename: function (req, file, cb) {
          cb(null,file.originalname + path.extname(file.originalname));
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
     console.log(user);
      
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
    res.redirect('/gotomyrequests');
});
  

module.exports = router;