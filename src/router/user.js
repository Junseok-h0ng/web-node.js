const express = require('express');
const auth = require('../lib/auth');
const router = express.Router();

router.get('/:userID', function (req, res) {
    res.render('user/user_page', {
        userStatus: auth.status(req)
    })
})

router.get('/login', function (req, res) {
    res.render('user/login', {
        modal: req.flash('error')
    });
});
router.get('/register', function (req, res) {
    res.render('user/register', {
        modal: req.flash('error')
    });
})

module.exports = router;