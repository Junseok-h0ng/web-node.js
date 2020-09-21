const express = require('express');
const router = express.Router();

router.get('/login', function (req, res) {
    res.render('user/login', {
        modal: req.flash('message')
    });
});
router.get('/register', function (req, res) {
    res.render('user/register', {
        modal: req.flash('message')
    });
})

module.exports = router;