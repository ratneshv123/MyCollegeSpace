const express = require('express');
const router = express.Router();


router.get('/routes/papers/MCA/MCAFIRST', (req, res) => {
    res.render('mcafirstsemester');
});

router.post('/fmcafirst', (req, res) => {
    //res.send('success'); 
    res.redirect('/routes/papers/MCA/MCAFIRST')
});

module.exports = router;