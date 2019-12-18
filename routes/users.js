const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//User model
const User = require('../models/User');


//Login page
router.get('/login', (req, res) => res.render('login'));

//Register page
router.get('/register', (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please enter all fields'});
    }

    if (password !== password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    if (password.length < 5) {
        errors.push({msg: 'Password must be at least 5 characters'});
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({email: email}).then(user => {
            console.log(user);
            if (user) {
                //User already Exist
                errors.push({msg: 'Email already exists'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
                console.log('if case', ' error =', errors.length);
            }else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});


//Login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect: '/users/login',
        failureFlash:true
    })(req,res,next);
});

//LogOut Handle
router.post('/logout',(req,res)=>{
    req.logout();
    req.Flash(
        'success_msg',
        'You are Logged Out'
    );
    res.redirect('/users/login');
});

module.exports = router;
