const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
var path = require('path');
const connection = require('../../../../db/db');


router.post('/updeltimetable', async(req, res) => {
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from timetable';
        connection.query(query, (err, result) => {
            if (err) reject(new Error('something is wrong here:' + err));
            resolve(result);
        });
    });
    res.render('updateanddeletetimetable', { users: alluser });
});


router.get("/uploadsuccesstimetable", async(req, res) => {
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from timetable';
        connection.query(query, (err, result) => {
            if (err) reject(new Error('something is wrong here:' + err));
            resolve(result);
        });
    });
    res.render('updateanddeletetimetable', { users: alluser });
    // res.render("updateanddeletetimetable");
  });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploading/timetable");
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});


var upload = multer({
  storage: storage,
}).single('file');

router.post("/uptimetable", (req, res) => {
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
       user = { 
       name: req.file.originalname,
       place: req.file.path,
       id:req.body.paperid,
       type: req.file.mimetype,
       size:req.file.size
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
            const query = `INSERT INTO timetable SET ?`;
               connection.query(query, user, (err, result)=> {
                   if (err) reject(new Error('Something failed (Record Insertion) :' + err));
                    resolve (result);
                   });
               }); 
  })
    res.redirect('/uploadsuccesstimetable');
});

router.post('/deletethistt', (req, res) => {
    console.log(req.body);
    const user = {
        name:req.body.Iname,
    }

    var filePath = 'G:/collegespace/public/uploading/timetable/'+user.name+'.pdf'; 
    fs.unlinkSync(filePath);

    const data = [[user.name]];
    new Promise((resolve, reject) => {
        const query = `DELETE FROM timetable WHERE name=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    res.redirect('/uploadsuccesstimetable');
});

module.exports = router;