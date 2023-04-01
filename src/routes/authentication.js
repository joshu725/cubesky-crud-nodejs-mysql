const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signup', isNotLoggedIn, function (req, res) {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, function (req, res) {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, function (req, res, next) {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile');
});

router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");  
    });
});

module.exports = router;