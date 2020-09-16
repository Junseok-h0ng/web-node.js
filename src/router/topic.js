const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('topic/programming');
});
router.get('/:title', function (req, res) {
    res.render('topic/topic');
})

module.exports = router;