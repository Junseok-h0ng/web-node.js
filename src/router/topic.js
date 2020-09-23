const express = require('express');
const shortid = require('shortid');
const db = require('../data/db');
const auth = require('../lib/auth');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();

router.get('/', function (req, res) {
    db.topicList((err, topic) => {
        res.render('topic/programming', {
            userStatus: auth.status(req),
            topic: topic
        });
    });

});

router.get('/create/:userID', function (req, res) {
    res.render('topic/create', {
        userStatus: auth.status(req),
        userID: req.params.userID
    })
})

router.get('/:pageID', function (req, res) {
    const pageID = req.params.pageID
    db.topic(pageID, (err, topic) => {
        console.log(topic);
        res.render('topic/topic', {
            userStatus: auth.status(req),
            topic: topic[0]
        });
    })

})

router.post('/create/:userID', function (req, res) {
    const post = req.body;
    const info = {
        id: shortid.generate(),
        title: sanitizeHtml(post.title),
        description: sanitizeHtml(post.description),
        userID: req.params.userID
    }
    db.insertTopic(info);
    res.redirect(`/topic/${info.id}`);
})

module.exports = router;