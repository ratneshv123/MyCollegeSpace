const express=require('express');
const router = express.Router();
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const connection = require('../../db/db');

router.get('/adminloginpanel', (req, res) => {
    var message = "";
    res.render('adminloginpanel',{message:message}); 
});

router.get('/logoutadmin', authenticateToken, (req, res) => {
    res.clearCookie('auth_token');
    var message = "";
    res.render('adminloginpanel',{message:message}); 
});

router.post('/adminloginpage', (req, res) => {
    //console.log('success');
    res.redirect('/adminloginpanel');
});

router.get('/welcome', (req, res) => {
 //   console.log('successs');
    res.render('welcomeadmin');
});


//all admin request routes goes here

router.get('/alladminregitrationrequest',authenticateToken, async(req, res) => { 
    const data = 1;
    const alluser = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM admin WHERE accepted=?';
        connection.query(query, data, (err, result) => {
            if (err) reject(new Error("something is wrong here:" + err));
            resolve(result);
        });
    });
    // console.log(alluser);
    res.render('updateanddeleteadminrequest',{users:alluser});
});

router.post('/acceptingadminrequest',authenticateToken, async (req, res) => {
    const acceptedval = 0;
    const datat = [[acceptedval], [req.body.id]];
    await new Promise((resolve, reject)=> {
        
        const query = `UPDATE admin SET accepted=? WHERE id=? `;
        connection.query(query,datat,(err, result)=> {
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));  
            resolve(result);
        });
    });
    const data = 1;
    const alluser = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM admin WHERE accepted=?';
        connection.query(query, data, (err, result) => {
            if (err) reject(new Error("something is wrong here:" + err));
            resolve(result);
        });
    });
    // console.log(alluser);
    res.render('updateanddeleteadminrequest',{users:alluser});
});


router.post('/rejectingadminrequest',authenticateToken, async (req, res) => {
    // console.log(req.body);
    new Promise((resolve, reject) => {
        const query = `DELETE FROM admin WHERE id=?`;
        connection.query(query,req.body.id, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    const data = 1;
    const alluser = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM admin WHERE accepted=?';
        connection.query(query, data, (err, result) => {
            if (err) reject(new Error("something is wrong here:" + err));
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('updateanddeleteadminrequest',{users:alluser});
});


router.post('/adminsignup',async(req, res) => {
    console.log(req.body);
    
    const schema = Joi.object({       
        Name: Joi.string().min(3).max(30).required(),
        Email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(11).max(100).required(),
        MobileNo:Joi.string().min(10).max(10),
        UserName: Joi.string().min(3).max(30).required(),
        Password: Joi.string().min(3).max(30)
    });

    
    const { error, value } = schema.validate({ Name:req.body.Iname,Email: req.body.Iemail,MobileNo:req.body.Imobno,UserName:req.body.Iusername, Password: req.body.Ipassword });

    if (error != undefined)   
    {   
        console.log(error);
        var success = "";
        console.log(value.Name);
        res.render('signuup', { message: error.details[0].message, success });
        return;    
    }
       
    // validation end here



    const acceptedval = 1;
    const user = {
        name: req.body.Iname,
        password: req.body.Ipassword,
        email: req.body.Iemail,
        mobileno: req.body.Imobno,
        username: req.body.Iusername,
        accepted:acceptedval
    };



    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    let data = [user.name,user.password,user.email,user.mobileno,user.username,user.accepted];
    await new Promise((resolve, reject) => {
        const query = `INSERT INTO admin SET name=?,password=?,email=?,mobileno=?,username=?,accepted=?`;
        connection.query(query, data, (err, result) => {
            if (err) {
                res.status(404).send('Duplicate:' + err);
                reject(new Error('Something failed (Record Insertion) :' + err));
            }
            resolve(result);
            var message=""
            res.render('signuup', { success: 'Registered Your Request for Admin Login , You can come back after three days to check your admin request',message:message });
        });
    });
});

router.post('/adminlogin', async (req, res) => {
    console.log(req.body);

    // validation starts from here
    const schema = Joi.object({
        username: Joi.string().min(6).max(100).required(),
        password: Joi.string().min(1).max(30)
    }); 
    const { error, value } = schema.validate({ username: req.body.Iname, password: req.body.Ipassword });

    if (error != undefined)  
    {
        console.log(error);
        res.render('adminloginpanel', { message: error.details[0].message });
        // res.status(400).send(error.details[0].message);
        return;    
    }
    // validation end here
    const acceptedval=0;
     const user = {
        name: req.body.Iname,
        password: req.body.Ipassword,
        accepted:acceptedval
    };
    const maxAge = 60000 * 60 * 24;
    const data = [[user.name], [user.accepted]];
    // console.log(data);
    try {
        await new Promise((resolve, reject) => {
            const query = `SELECT password FROM admin WHERE username=? AND accepted=?`;
            connection.query(query,data,(err, result) => {
                if (err) {
                    res.status(404).send(`Not Found` + err);
                    // reject(new Error('Something failed (Record Insertion) :' + err));
                } else
                if (result.length == 0)
                {
                    var message = "Invalid UserName or Password";
                    console.log('not found');
                    res.render('adminloginpanel', { message: message});
                } else
                {
                bcrypt.compare(user.password,result[0].password, (err, result) => {
                    if (result === true) {
                    const token = jwt.sign({name: user.name}, process.env.SECRET_KEY,{ expiresIn: maxAge });
                    // res.header("auth-token", token);
                    res.cookie('auth_token', token, {maxAge: maxAge, httpOnly: true });
                    // console.log(token);
                       res.render('welcomeadmin');  
                    } else
                    {
                        var message = "Invalid UserName or Password";
                        res.render('adminloginpanel', { message: message});
                     }
                });  
                }
                 resolve(result);
            });
        });  
    }
    catch (error)
    {
        console.log('Error is:'+error);
    }
});

router.post('/adminprofile',authenticateToken,async (req, res) => {
    console.log(req.user_auth);
    const alluser = await new Promise((resolve, reject) => {
        const query = 'SELECT id,name,email,username,mobileno FROM admin WHERE username=?';
        connection.query(query,req.user_auth.name, (err, result) => {
            if (err) reject(new Error("something is wrong here:" + err));
            resolve(result);
        });
    });
    console.log(alluser);
    res.render('updownviewingadmindetails', { users: alluser });
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


module.exports=router;