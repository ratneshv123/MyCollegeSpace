const express = require('express');
const router = express.Router();

router.get('/routes/papers', (req, res) => {
    res.render('papers'); 
});

router.post('/papersuser', (req, res) => {
   // console.log(req.body); 
    res.redirect('/routes/papers');
});


module.exports = router;