const express=require('express');
const router = express.Router();
const connection = require('../../db/db');

router.get('/adminloginpanel', (req, res) => {
    var message = "";
    res.render('adminloginpanel',{message:message}); 
});

router.post('/adminloginpage', (req, res) => {
    //console.log('success');
    res.redirect('/adminloginpanel');
});

router.get('/welcome', (req, res) => {
    console.log('successs');
    res.render('welcomeadmin');
});


//all admin request routes goes here

router.get('/alladminregitrationrequest',async(req, res) => { 
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

router.post('/acceptingadminrequest', async (req, res) => {
    const acceptedval = 0;
    const datat = [[acceptedval], [req.body.id]];
    await new Promise((resolve, reject)=> {
        //console.log(this);
        const query = `UPDATE admin SET accepted=? WHERE id=? `;
        connection.query(query,datat,(err, result)=> {
            if (err)    reject(new Error('Something failed (Record Updation) :'+err));  
            resolve(result);
           // console.log(result);
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


router.post('/rejectingadminrequest', async (req, res) => {
    console.log(req.body);
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


// router.post('/welcomeadmin', async(req, res) => {
//     console.log(req.body);
//     const user = {
//         name: req.body.Iname,
//         password: req.body.Ipassword
//     };
//     let data = [user.name,user.password];
//     // console.log(data[0]);
//     // console.log(data[1]);
//     await new Promise((resolve, reject) => {
//         const query = `SELECT name,password FROM admin WHERE name=? AND password=? `;
//         connection.query(query, data, (err, result) => {
//            //console.log('Result:' + result);
//             if (err) {
//                 res.status(404).send(`Not Found` + err);
//                 reject(new Error('Something failed (Record Insertion) :' + err));
//             }
//             if(result.length == 0) {
//                // res.send('Wrong Information');
//                 res.redirect('/adminloginpanel');
//                // console.log('not found');
//             }
//             else {
//                /// console.log(result[0].email, result[0].password);
//                res.redirect('/welcome'); 
//                //res.send('Successfull');
//             }
//             // console.log(result);
//             resolve(result);
//            // res.render('usersignin');
//         });
//     });
//    // res.send('successs');
// });

module.exports=router;