const db = require('../data/db');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const flash = require('connect-flash');

module.exports = function (app) {
    const passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        db.user('id', id, (err, user) => {
            return done(null, user[0]);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {

        db.user('email', email, (err, user) => {
            if (user[0]) {
                bcrypt.compare(password, user[0].pwd, (err, result) => {
                    if (result) {
                        return done(null, user[0]);
                    } else {
                        return done(null, false, {
                            message: '잘못된 패스워드 입니다.'
                        });
                    }
                });
            } else {
                return done(null, false, {
                    message: '잘못된 이메일 입니다.'
                })
            }
        })
    }
    ));

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/user/login',
        })
    );
    app.post('/register', function (req, res) {
        const user = req.body;
        const id = shortid.generate();

        if (user.password != user.password2) {
            req.flash('message', '입력한 비밀번호가 서로 맞지 않습니다.');
            res.redirect('/user/register');
        }
        db.user('email', user.email, (err, user) => {
            if (user[0]) {
                req.flash('message', '이미 있는 이메일 입니다.')
                res.redirect('/user/register');
            }
        });

        bcrypt.hash(user.password, 10, (err, pwd) => {
            db.insertUser(id, user, pwd);
            user.id = id;
            user.password = pwd;
            req.login(user, function () {
                res.redirect('/');
            });

        });
    })
    app.get(`/logout`, function (req, res) {
        req.logout();
        req.session.save(function () {
            res.redirect('/');
        });
    });
}