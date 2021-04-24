const { response } = require('express');
const bcrypt=require('bcryptjs');
const express = require('express');
const connection = require('../db/db');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const router = express.Router();
const fs = require('fs');
const Joi = require('joi');
const { ValidationError } = require('joi');
//const connection = require('../db/db');



router.get('/signuup', (req, res) => {
    var message = "";
    res.render('signuup', { success: '' ,message:message});
});

router.get('/homechle', authenticateToken, (req, res) => {
    res.clearCookie('auth_token');
    res.render('home');
});





router.post('/signinuser', async (req, res) => {
    console.log(req.body);

    // validation starts from here

    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(11).max(100).required(),
        password: Joi.string().min(3).max(30)
    });

    // schema.validate({ email: req.body.Iemail, password: req.body.Ipassword });
    
    const { error, value } = schema.validate({ email: req.body.Iemail, password: req.body.Ipassword });

    if (error != undefined)  
    {
        console.log(error);
        res.render('home', { message: error.details[0].message });
        // res.status(400).send(error.details[0].message);
        return;    
    }
       
    // validation end here

    const user = {  
        email: req.body.Iemail,
        password: req.body.Ipassword
    };
    //  console.log('hello');
    const maxAge = 60000 * 60 * 24;
   await new Promise((resolve, reject) => {
        const query = `SELECT password FROM signup WHERE email=?`;
        connection.query(query,user.email, (err, result) => {
            if (err) {
                res.status(404).send(`Not Found` + err);
                reject(new Error('Something failed (Record Insertion) :' + err));
            }
            bcrypt.compare(user.password,result[0].password, (err, result) => {
                if (result === true) {
                    // console.log('success');
                    const token = jwt.sign({email: user.email}, process.env.SECRET_KEY,{ expiresIn: maxAge });
                    // res.header("auth-token", token);
                    res.cookie('auth_token', token, {maxAge: maxAge, httpOnly: true });
                    console.log(token);
                    res.render('usersignin', { user: user });
                } else 
                {
                    console.log('failure');
                    var message = "Invalid Email or Password";
                    res.render('home',{message:message});
                // res.status(404).send(`Not Found` + err);
                // reject(new Error('Something failed (Record Insertion) :' + err));
                }
            });
             resolve(result);
        });
    });

 
});



router.post('/signupuser', async (req, res) => {
    console.log(req.body);
    
    const schema = Joi.object({
        Name: Joi.string().min(3).max(30).required(),
        CollegeId:Joi.string().min(3).max(30).required(),
        Email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(11).max(100).required(),
        Password: Joi.string().min(3).max(30)
    });
    
    const { error, value } = schema.validate({ Name:req.body.Iname,CollegeId:req.body.Icllgid,Email: req.body.Iemail, Password: req.body.Ipassword });

    if (error != undefined)   
    {
        console.log(error);
        var success = "";
        res.render('signuup', { message: error.details[0].message,success});
        // res.status(400).send(error.details[0].message);
        return;    
    }
       
    // validation end here


    const user = {
        name: req.body.Iname,
        cllgid: req.body.Icllgid,
        password: req.body.Ipassword,
        email: req.body.Iemail
    };

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    let data = [user.name, user.cllgid, user.password, user.email];
    await new Promise((resolve, reject) => {
        const query = `INSERT INTO signup SET name=? ,cllgid=? , password=? , email=?`;
        connection.query(query, data, (err, result) => {
            if (err) {
                res.status(404).send('Duplicate:' + err);
                reject(new Error('Something failed (Record Insertion) :' + err));
            }
            resolve(result);
            // res.send('Succesfully registered');
            const message = "";
            res.render('signuup', { success: 'Successfully registered',message:message});
 
        });
    });
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
            res.render('signuup', { success: 'Registered Your Request for Admin Login , You will get Notified Via mail when Admin will accept your request.',message:message });
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
    const data = [[user.name], [user.accepted]];
    // console.log(data);
    // console.log('hello');
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
                        console.log('success');
                       res.render('welcomeadmin', {user: user});  
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


function authenticateToken(req, res, next) {
    console.log(req.cookies);
    const token = req.cookies.auth_token;
    if (token) {
        // const token = req.cookies.auth_token;
        const  user_auth  = jwt.verify(token, process.env.SECRET_KEY || "UNSECURED_JWT_PRIVATE_TOKEN");
    //    const user= jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    //         // const id = payload.id;
    //         const user = {
    //             email: payload.email
    //         }
            req.user_auth = user_auth;
            next();
    //     });   
    }
    else {
        res.redirect('/');
    }
}

module.exports = router;