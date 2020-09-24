const express = require('express');
const shortid = require('shortid');
const db = require('../data/db');
const auth = require('../lib/auth');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();

router.get('/', function (req, res) {
    db.topicList((err, topic) => {
        console.log(topic);
        res.render('topic/programming', {
            userStatus: auth.status(req),
            topic: topic
        });
    });

});

//생성 페이지
router.get('/create/:userID', function (req, res) {
    const userID = req.params.userID;
    db.user('id', userID, (err, user) => {
        //잘못된 아이디 접근시 에러 처리
        if (user[0] == undefined) { return res.redirect('/topic'); }

        res.render('topic/create', {
            userStatus: auth.status(req),
            userID: req.params.userID
        });
    });

})

router.get('/:pageID', function (req, res) {
    const pageID = req.params.pageID;
    db.topic(pageID, (err, topic) => {
        //잘못된 접근시 에러 처리
        if (topic[0] == undefined) { return res.redirect('/topic'); }

        res.render('topic/topic', {
            userStatus: auth.status(req),
            topic: topic[0]
        });
    })

})

//생성 프로세스
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