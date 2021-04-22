const express = require('express');
const router = express.Router();


router.get('/routes/papers/MCA/MCASIXTH', (req, res) => {
    res.render('mcasixthsemester');
});

router.post('/fmcasixth', (req, res) => {
    //res.send('success'); 
    res.redirect('/routes/papers/MCA/MCASIXTH')
});

module.exports = router;