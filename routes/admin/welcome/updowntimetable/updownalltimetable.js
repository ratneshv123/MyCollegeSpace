const express = require('express');
const router = express.Router();
const multer = require("multer");
const jwt = require('jsonwebtoken');
const fs = require('fs');
var path = require('path');
const connection = require('../../../../db/db');


router.post('/updeltimetable',authenticateToken, async(req, res) => {
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from timetable';
        connection.query(query, (err, result) => {
            if (err) reject(new Error('something is wrong here:' + err));
            resolve(result);
        });
    });
    res.render('updateanddeletetimetable', { users: alluser });
});


router.get("/uploadsuccesstimetable",authenticateToken, async(req, res) => {
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

router.post("/uptimetable",authenticateToken, (req, res) => {
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

router.post('/deletethistt',authenticateToken, async(req, res) => {
    console.log(req.body);
    const user = {
        name: req.body.Iname,
        timetableid:req.body.Itimetableprimeid
    }


    const datacheck=[[user.name]]
    const checking=await new Promise((resolve, reject) => {
        const query = `SELECT name FROM timetable WHERE name=?`;
        connection.query(query,datacheck, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    

    var filePath = 'G:/MyCollegeSpace/public/uploading/timetable/'+user.name+'.pdf';
    if(checking.length==1)
    fs.unlinkSync(filePath);


    const data = [[user.name],[user.timetableid]];
    new Promise((resolve, reject) => {
        const query = `DELETE FROM timetable WHERE name=? AND timetableid=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    res.redirect('/uploadsuccesstimetable');
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