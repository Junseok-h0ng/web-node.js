const express = require('express');
const auth = require('../lib/auth');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('topic/programming', {
        userStatus: auth.status(req)
    });
});
router.get('/:title', function (req, res) {
    res.render('topic/topic');
})

module.exports = router;