const express = require('express');
const shortid = require('shortid');
const db = require('../data/db');
const auth = require('../lib/auth');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('topic/programming', {
        userStatus: auth.status(req)
    });
});

router.get('/create/:userID', function (req, res) {
    res.render('topic/create', {
        userStatus: auth.status(req),
        userID: req.params.userID
    })
})

router.get('/:title', function (req, res) {
    res.render('topic/topic');
})

router.post('/create/:userID',function(req,res){
    const post = req.body;
    const info = {
        id: shortid.generate(),
        title : post.title,
        description : post.description,
        userID : req.params.userID
    }
    db.insertTopic(info);
})

module.exports = router;