const express = require('express');
const router = express.Router();


router.get('/routes/papers/MCA/MCASECOND', (req, res) => {
    res.render('mcasecondsemester');
});

router.post('/fmcasecond', (req, res) => {
    //res.send('success'); 
    res.redirect('/routes/papers/MCA/MCASECOND')
});

module.exports = router;