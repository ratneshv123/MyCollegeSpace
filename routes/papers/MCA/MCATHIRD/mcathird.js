const express = require('express');
const router = express.Router();


router.get('/routes/papers/MCA/MCATHIRD', (req, res) => {
    res.render('mcathirdsemester');
});

router.post('/fmcathird', (req, res) => {
    //res.send('success'); 
    res.redirect('/routes/papers/MCA/MCATHIRD')
});

module.exports = router;