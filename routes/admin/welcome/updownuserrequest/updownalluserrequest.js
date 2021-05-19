const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const jwt = require('jsonwebtoken');
var path = require('path');
const connection = require('../../../../db/db');

//idhr se shuru hai 

router.get('/updelrequest',authenticateToken,(req, res) => {
    res.render('updateanddeleteuserrequest'); 
});

router.get('/alluserrequests',authenticateToken, async (req, res) => {
    var pre = 1;
    const alluser = await new Promise((resolve, reject) => {
        const query = 'select * from mcapapers where presence=?';
        connection.query(query,pre, (err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        })
    });
    const alluser1 = await new Promise((resolve, reject) => {
        const query = 'select * from books where presence=?';
        connection.query(query, pre, (err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        })
    });
    const alluser2 = await new Promise((resolve, reject) => {
        const query = 'select * from notes where presence=?';
        connection.query(query,pre, (err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        })
    });
    res.render('updateanddeleteuserrequest', { userp: alluser , userb:alluser1, usern:alluser2});
});

router.post('/prequest',authenticateToken, async (req, res) => {
    var pre = 1;
    const alluser = await new Promise((resolve, reject) => {
        const query = 'select * from mcapapers where presence=?';
        connection.query(query,pre, (err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        })
    });
    const alluser1 = await new Promise((resolve, reject) => {
        const query = 'select * from books where presence=?';
        connection.query(query, pre, (err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        })
    });
    const alluser2 = await new Promise((resolve, reject) => {
        const query = 'select * from notes where presence=?';
        connection.query(query,pre, (err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        })
    });
    res.render('updateanddeleteuserrequest', { userp: alluser , userb:alluser1, usern:alluser2});
});


router.post('/paperdeleterequest',authenticateToken, async (req, res) => {
    console.log(req.body);
    var pre = 3;
    const user = {
        presence:pre,
        name: req.body.delname,
        id: req.body.delid
    }

    var filePath = 'G:/MyCollegeSpace/public/uploading/mcapapers/'+user.name+'.pdf'; 
     fs.unlinkSync(filePath);

    const data = [[user.presence],[user.name],[user.id]];
    await new Promise((resolve, reject) => { 
        const query = `UPDATE mcapapers SET presence =? WHERE name=? AND id=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    await new Promise((resolve, reject) => {
        const query = `DELETE FROM mcapapers WHERE presence=? AND name=? AND id=? `;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    res.redirect('/alluserrequests');
});


router.post('/paperacceptrequest',authenticateToken, async(req, res) => {
    console.log(req.body);
    var pre = 2;
    const user = {
        presence:pre,
        name: req.body.delname,
        id: req.body.delid
    }
    const data = [[user.presence],[user.name],[user.id]];
    await new Promise((resolve, reject) => {
        const query = `UPDATE mcapapers SET presence =? WHERE name=? AND id=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    res.redirect('/alluserrequests');
});



// notes request

router.post('/notesdeleterequest',authenticateToken, async (req, res) => {
    console.log(req.body);
    var pre = 3;
    const user = {
        presence:pre,
        name: req.body.delname,
        id: req.body.delid
    }

    var filePath = 'G:/MyCollegeSpace/public/uploading/notes/'+user.name+'.pdf'; 
    fs.unlinkSync(filePath);

    const data = [[user.presence],[user.name],[user.id]];
    await new Promise((resolve, reject) => {
        const query = `UPDATE notes SET presence =? WHERE name=? AND id=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    await new Promise((resolve, reject) => {
        const query = `DELETE FROM notes WHERE presence=? AND name=? AND id=? `;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    res.redirect('/alluserrequests');
});


router.post('/notesacceptrequest',authenticateToken, async(req, res) => {
    console.log(req.body);
    var pre = 2;
    const user = {
        presence:pre,
        name: req.body.delname,
        id: req.body.delid
    }
    const data = [[user.presence],[user.name],[user.id]];
    await new Promise((resolve, reject) => {
        const query = `UPDATE notes SET presence =? WHERE name=? AND id=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    res.redirect('/alluserrequests');
});



// books request


router.post('/booksdeleterequest',authenticateToken, async (req, res) => {
    console.log(req.body);
    var pre = 2;
    const user = {
        presence:pre,
        name: req.body.delname,
        id: req.body.delid
    }

    var filePath = 'G:/MyCollegeSpace/public/uploading/books/'+user.name+'.pdf'; 
     fs.unlinkSync(filePath);

    const data = [[user.presence],[user.name],[user.id]];
    await new Promise((resolve, reject) => {
        const query = `UPDATE books SET presence =? WHERE name=? AND id=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    await new Promise((resolve, reject) => {
        const query = `DELETE FROM books WHERE presence=? AND name=? AND id=? `;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    res.redirect('/alluserrequests');
});


router.post('/booksacceptrequest',authenticateToken, async(req, res) => {
    console.log(req.body);
    var pre = 2;
    const user = {
        presence:pre,
        name: req.body.delname,
        id: req.body.delid
    }
    const data = [[user.presence],[user.name],[user.id]];
    await new Promise((resolve, reject) => {
        const query = `UPDATE books SET presence =? WHERE name=? AND id=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    res.redirect('/alluserrequests');
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