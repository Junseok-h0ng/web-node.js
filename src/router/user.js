const express = require('express');
const router = express.Router();

router.get('/login', function (req, res) {
    res.render('user/login');
});
router.get('/register', function (req, res) {
    res.render('user/register');
})

module.exports = router;