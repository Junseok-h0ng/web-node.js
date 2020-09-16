const db = require('../data/db');

module.exports = function (app) {
    const passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        console.log('ee');
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        console.log(id);
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {

        db.user(email, (err, user) => {
            if (user[0].email === email) {
                return done(null, user[0]);
            } else {
                return done(null, false);
            };
        })
    }
    ));

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/user/login',
            failureFlash: true
        })
    );

}

