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
    res.redirect(`/topic/${parentID}/${info.id}`)
});
module.exports = router;