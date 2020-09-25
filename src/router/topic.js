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

//생성 페이지
router.get('/create/:userID', (req, res) => {
    const userID = req.params.userID;

    //잘못된 아이디 접근시 에러 처리
    if (!auth.isOwner(req, userID)) { return res.redirect('/'); }

    res.render('topic/create', {
        userStatus: auth.status(req),
        userID: userID
    });
})
router.get('/update/:pageID', (req, res) => {
    const pageID = req.params.pageID;

    db.topic(pageID, (err, topic) => {
        //토픽이 존재하는지
        if (topic[0]) {
            const userID = topic[0].user_id;
            //topic의 작성자가 아닐경우
            if (!auth.isOwner(req, userID)) { return res.redirect('/'); }
        } else {
            //토픽이 없을경우
            return res.redirect('/');
        }
        res.render('topic/update', {
            userStatus: auth.status(req),
            pageID: pageID,
            topic: topic[0]
        });
    });
});
router.get('/:pageID', (req, res) => {
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
router.post('/create/:userID', (req, res) => {
    const post = req.body;
    const userID = req.params.userID;
    const info = {
        id: shortid.generate(),
        title: sanitizeHtml(post.title),
        description: sanitizeHtml(post.description),
        userID: userID
    }
    db.insertTopic(info);
    res.redirect(`/topic/${info.id}`);
});

//업데이트 프로세스
router.post('/update/:pageID', (req, res) => {
    const post = req.body;
    const info = {
        id: req.params.pageID,
        title: sanitizeHtml(post.title),
        description: sanitizeHtml(post.description)
    }
    db.updateTopic(info);
    res.redirect(`/topic/${info.id}`);
});
//삭제 프로세스
router.post('/delete/:pageID', (req, res) => {
    const pageID = req.params.pageID;
    db.deleteTopic(pageID);
    res.redirect(`/user/${req.user.id}`);
});

module.exports = router;