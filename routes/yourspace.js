const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connection = require('../db/db');

router.post('/yourpersonalspace',authenticateToken,(req, res) => {
    res.render('yourspace');
});

// userprivatesections -papers start

router.post('/yourspacepapers', authenticateToken, async(req, res) => {
    var message = "Papers";
    console.log(req.user_auth);
    const user = {
        email: req.user_auth.email,
        typed:"paper"
    }
    const data = [[user.email], [user.typed]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from yourspace where email=? AND typed=?';
        connection.query(query,data,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('yourprivatesectionrecords',{users:alluser,message:message});
});

router.post('/yourspacebooks', authenticateToken,async(req, res) => {
    var message = "Books";
    console.log(req.user_auth);
    const user = {
        email: req.user_auth.email,
        typed:"books"
    }
    const data = [[user.email], [user.typed]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from yourspace where email=? AND typed=?';
        connection.query(query,data,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('yourprivatesectionrecords',{users:alluser,message:message});
});


router.post('/yourspacetimetable', authenticateToken, async(req, res) => {
    var message = "TimeTable";
    console.log(req.user_auth);
    const user = {
        email: req.user_auth.email,
        typed:"timetable"
    }
    const data = [[user.email], [user.typed]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from yourspace where email=? AND typed=?';
        connection.query(query,data,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('yourprivatesectionrecords',{users:alluser,message:message});
});


router.post('/yourspacenotes', authenticateToken,async(req, res) => {
    var message = "Notes";
    console.log(req.user_auth);
    const user = {
        email: req.user_auth.email,
        typed:"notes"
    }
    const data = [[user.email], [user.typed]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT * from yourspace where email=? AND typed=?';
        connection.query(query,data,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('yourprivatesectionrecords',{users:alluser,message:message});
});

router.post('/watchingprivaterecords', authenticateToken, async(req, res) => {
    console.log(req.body);
    let alluser;
    let message1 = "";
    let message2 = "";
    if (req.body.typed == "Papers")
    {
        const res = "paper";
        const user = {
            typei:res,
            email:req.user_auth.email,
            name: req.body.name,
            id:req.body.semester
        }
        const data = [[user.typei],[user.email],[user.name],[user.id]];
        alluser =await new Promise((resolve, reject) => {
            const query = 'SELECT * from yourspace where typed=? AND email=? AND name=? AND semester=?';
            connection.query(query,data,(err, result) => {
                if (err) reject(new Error("something is wrong:" + err));
                resolve(result);
            });
        });
        console.log(alluser);
        message1 = "mcapapers";
        message2 = "Paper";
    } else
    if (req.body.typed == "Books")
    {
        const res = "books";
        const user = {
            typei:res,
            email:req.user_auth.email,
            name: req.body.name,
            id:req.body.semester
        }
        const data = [[user.typei],[user.email],[user.name],[user.id]];
        alluser =await new Promise((resolve, reject) => {
            const query = 'SELECT * from yourspace where typed=? AND email=? AND name=? AND semester=?';
            connection.query(query,data,(err, result) => {
                if (err) reject(new Error("something is wrong:" + err));
                resolve(result);
            });
        });
        console.log(alluser);
        message1 = "books";
        message2 = "Books";
    } else
    if(req.body.typed == "Notes")
    {
        const res = "notes";
        const user = {
            typei:res,
            email:req.user_auth.email,
            name: req.body.name,
            id:req.body.semester
        }
        const data = [[user.typei],[user.email],[user.name],[user.id]];
        alluser =await new Promise((resolve, reject) => {
            const query = 'SELECT * from yourspace where typed=? AND email=? AND name=? AND semester=?';
            connection.query(query,data,(err, result) => {
                if (err) reject(new Error("something is wrong:" + err));
                resolve(result);
            });
        });
        console.log(alluser);
        message1 = "notes";
        message2 = "Notes";
    } else
    if(req.body.typed == "TimeTable")
    {
        const res = "timetable";
        const user = {
            typei:res,
            email:req.user_auth.email,
            name: req.body.name,
            id:req.body.semester
        }
        const data = [[user.typei],[user.email],[user.name],[user.id]];
        alluser =await new Promise((resolve, reject) => {
            const query = 'SELECT * from yourspace where typed=? AND email=? AND name=? AND semester=?';
            connection.query(query,data,(err, result) => {
                if (err) reject(new Error("something is wrong:" + err));
                resolve(result);
            });
        });
        console.log(alluser);
        message1 = "timetable";
        message2 = "TimeTable";
    }    
    res.render('userviewingprivatesecrecords',{users:alluser,message1:message1,message2:message2}); 
    // res.send('success');
});




router.post('/deletingprivaterecord', authenticateToken, async(req, res) => {
    console.log(req.body);
    let viewrecord;
    let message = "";
    if (req.body.typed == "Papers")
    {
        const res = "paper";
        const user = {
            typei:res,
            email:req.user_auth.email,
            name: req.body.name,
            id:req.body.semester
        }
        const data = [[user.typei],[user.email],[user.name],[user.id]];
        new Promise((resolve, reject) => {
            const query = `DELETE FROM yourspace WHERE typed=? AND email=? AND name=? AND semester=?`;
            connection.query(query,data, (err, result) => {
                if (err) reject(new Error('something failed:'+err));
                    resolve(result);
            });
        });
    const watchusers = [[user.email], [user.typei]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT name,semester from yourspace where email=? AND typed=?';
        connection.query(query,watchusers,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        }); 
    });
        viewrecord = alluser;
        message = "Papers";
    } else
    if (req.body.typed == "Books")
    {
        const res = "books";
        const user = {
            typei:res,
            email:req.user_auth.email,
            name: req.body.name,
            id:req.body.semester
        }
        const data = [[user.typei],[user.email],[user.name],[user.id]];
        new Promise((resolve, reject) => {
            const query = `DELETE FROM yourspace WHERE typed=? AND email=? AND name=? AND semester=?`;
            connection.query(query,data, (err, result) => {
                if (err) reject(new Error('something failed:'+err));
                    resolve(result);
            });
        });
    const watchusers = [[user.email], [user.typei]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT name,semester from yourspace where email=? AND typed=?';
        connection.query(query,watchusers,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        }); 
    });
    viewrecord = alluser;
        message = "Books";
    } else
    if(req.body.typed == "Notes")
    {
        const res = "notes";
        const user = {
            typei:res,
            email:req.user_auth.email,
            name: req.body.name,
            id:req.body.semester
        }
        const data = [[user.typei],[user.email],[user.name],[user.id]];
        new Promise((resolve, reject) => {
            const query = `DELETE FROM yourspace WHERE typed=? AND email=? AND name=? AND semester=?`;
            connection.query(query,data, (err, result) => {
                if (err) reject(new Error('something failed:'+err));
                    resolve(result);
            });
        });
    const watchusers = [[user.email], [user.typei]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT name,semester from yourspace where email=? AND typed=?';
        connection.query(query,watchusers,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        }); 
    });
    viewrecord = alluser;
        message = "Notes";
    } else
    if(req.body.typed == "TimeTable")
    {
        const res = "timetable";
        const user = {
            typei:res,
            email:req.user_auth.email,
            name: req.body.name,
            id:req.body.semester
        }
        const data = [[user.typei],[user.email],[user.name],[user.id]];
        new Promise((resolve, reject) => {
            const query = `DELETE FROM yourspace WHERE typed=? AND email=? AND name=? AND semester=?`;
            connection.query(query,data, (err, result) => {
                if (err) reject(new Error('something failed:'+err));
                    resolve(result);
            });
        });
    const watchusers = [[user.email], [user.typei]];
    const alluser =await new Promise((resolve, reject) => {
        const query = 'SELECT name,semester from yourspace where email=? AND typed=?';
        connection.query(query,watchusers,(err, result) => {
            if (err) reject(new Error("something is wrong:" + err));
            resolve(result);
        }); 
    });
        viewrecord = alluser;
        message = "TimeTable";
    }    
    res.render('yourprivatesectionrecords',{users:viewrecord,message:message}); 
    // res.send('success');
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