const db = require('../data/db');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

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
                        return done(null, false);
                    }
                });
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
    app.get('/register', function (req, res) {
        res.redirect('/');
    })
    app.post('/register', function (req, res) {
        const user = req.body;
        const id = shortid.generate();
        bcrypt.hash(user.password, 10, (err, pwd) => {
            db.insertUser(id, user, pwd)
        });
        res.redirect('/');
    })
    app.get(`/logout`, function (req, res) {
        req.logout();
        req.session.save(function () {
            res.redirect('/');
        });
    });
}