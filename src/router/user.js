const bcrypt = require('bcrypt');
const express = require('express');
const db = require('../data/db');
const auth = require('../lib/auth');
const router = express.Router();

function renderPage(req, res, mod) {
    const userID = req.params.userID;
    res.render('user/user_page', {
        userStatus: auth.status(req),
        userID: userID,
        mod: mod,
        modal: req.flash('error')
    });

}

router.get('/login', function (req, res) {
    res.render('user/login', {
        modal: req.flash('error')
    });
});
router.get('/register', function (req, res) {
    res.render('user/register', {
        modal: req.flash('error')
    });
});
router.get('/delete/:userID', (req, res) => {
    renderPage(req, res, 'delete');
});
router.get('/change/:userID', (req, res) => {
    renderPage(req, res, 'change');
});
router.get('/:userID', (req, res) => {
    const userID = req.params.userID;
    db.userTopic(userID, (err, topic) => {
        renderPage(req, res, topic);
    });
});

router.post('/delete/:userID', (req, res) => {
    const post = req.body;
    const pwd = post.password;
    const pwd2 = post.password2;
    const userID = req.params.userID;
    db.user('id', userID, (err, user) => {
        bcrypt.compare(pwd, user[0].pwd, (err, result) => {
            //패스워드 일치시 계정 삭제
            if (result) {
                if (pwd == pwd2) {
                    req.logout();
                    req.session.save(() => {
                        db.deleteUser(userID);
                        //계정으로 작성한 글 삭제 추가해야함
                        req.flash('message', '정상적으로 삭제되었습니다.');
                        res.redirect('/');
                    });
                } else {
                    req.flash('error', '입력한 비밀번호가 서로 맞지 않습니다.');
                    res.redirect(`/user/delete/${userID}`);
                }
            } else {
                req.flash('error', '잘못된 비밀번호입니다.');
                res.redirect(`/user/delete/${userID}`);
            }
        });
    });
});
router.post('/change/:userID', (req, res) => {
    const userID = req.params.userID;
    const post = req.body;
    const oldPwd = post.oldPassword;
    const newPwd = post.newPassword;
    const newPwd2 = post.newPassword2;
    db.user('id', userID, (err, user) => {
        bcrypt.compare(oldPwd, user[0].pwd, (err, result) => {
            //기존 패스워드 일치
            if (result) {
                console.log(result);
                //새로운 패스워드 일치시 패스워드 변경
                if (newPwd === newPwd2) {
                    bcrypt.hash(newPwd, 10, (err, newPwd) => {
                        db.changePwdUser(newPwd, userID);
                        req.flash('message', '정상적으로 변경되었습니다.');
                        res.redirect('/');
                    });
                } else {
                    //패스워드 불일치
                    req.flash('error', '입력한 비밀번호가 서로 맞지 않습니다.');
                    res.redirect(`/user/change/${userID}`);
                }
            } else {
                req.flash('error', '기존 패스워드가 맞지 않습니다.');
                res.redirect(`/user/change/${userID}`);
            }
        })
    });
});
module.exports = router;