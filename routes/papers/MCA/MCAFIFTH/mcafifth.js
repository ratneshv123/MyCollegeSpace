const express = require('express');
const router = express.Router();


router.get('/routes/papers/MCA/MCAFIFTH', (req, res) => {
    res.render('mcafifthsemester');
});

router.post('/fmcafifth', (req, res) => {
    //res.send('success'); 
    res.redirect('/routes/papers/MCA/MCAFIFTH')
});

module.exports = router;