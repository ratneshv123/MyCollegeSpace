const express = require('express');
const router = express.Router();


router.get('/routes/papers/MCA/MCAFOURTH', (req, res) => {
    res.render('mcafourthsemester');
});

router.post('/fmcafourth', (req, res) => {
    //res.send('success'); 
    res.redirect('/routes/papers/MCA/MCAFOURTH')
});

module.exports = router;