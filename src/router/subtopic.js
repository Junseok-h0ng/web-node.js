const express = require('express');
const shortid = require('shortid');
const db = require('../data/db');
const auth = require('../lib/auth');
const sanitizeHtml = require('sanitize-html');

const router = express.Router();

router.get('/create/:parent', (req, res) => {
    const parent = req.params.parent;
    res.render('topic/create', {
        userStatus: auth.status(req),
        params: parent,
        type: 'sub'
    })
})

router.get('/update/:subtopic', (req, res) => {
    const subtopicID = req.params.subtopic;

    db.subtopic(subtopicID, (err, subtopic) => {
        res.render('topic/update', {
            userStatus: auth.status(req),
            pageID: subtopicID,
            topic: subtopic[0],
            type: "subtopic"
        })
    });
})

router.post('/create/:parentID', (req, res) => {
    const parentID = req.params.parentID;
    const post = req.body;
    const info = {
        id: shortid.generate(),
        title: post.title,
        description: post.description,
        parentID: parentID
    }
    db.insertSubtopic(info);
    res.redirect(`/topic/${parentID}/${info.id}`);
});

router.post('/update/:subtopic', (req, res) => {
    const subtopicID = req.params.subtopic
    const post = req.body;
    const info = {
        id: subtopicID,
        title: sanitizeHtml(post.title),
        description: post.description,
    }
    db.updateSubtopic(info, (err, parentID) => {
        res.redirect(`/topic/${parentID}/${subtopicID}`);
    });
});

router.post('/delete/:subtopic', (req, res) => {
    const subtopicID = req.params.subtopic;
    db.deleteSubtopic(subtopicID);
    res.redirect('/');
})

module.exports = router;