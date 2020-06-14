var express = require('express');
require('dotenv').config()
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');



let { encryptPassword } = require('../config/bcryptConfig');
let { generateJwt, verifyToken } = require('../config/jwtConfig');

// Imports of the model schemas
const User = require('../models/Userschema');

// FRONTEND STARTS HERE
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// router.get('/login', (req, res, next) => {
//     res.render('login');
// });

router.get('/register', (req, res, next) => {
    res.render('register');
});

// FRONTEND ENDS HERE

// BACKEND STARTS HERE

router.post('/register', async(req, res) => {
    try {
        const userEmail = await User.findOne({ email: req.body.email }).exec();
        if (userEmail) {
            throw new Error('Email already used in another account');
        }
        const userPhone = await User.findOne({ phone: req.body.phone }).exec();
        if (userPhone) {
            throw new Error('Phone number already used in another account');
        }
        // the password entered by the frontend will be encrypted by the use of encrypt passsord function
        const hash = await encryptPassword(req.body.password);
        req.body.password = hash
            // the data is saved with the password in the form of  encrypted string
        let newuser = await new User(req.body).save();
        res.json({ message: "You have been registered.", success: true });
    } catch (err) {
        console.log(err);
        res.json({ message: err.message, success: false });
    }
});


router.post('/verify', verifyToken, async(req, res) => {
    try {
        res.json(req.tokenConfig);
    } catch (error) {
        res.json({ message: "code not works" });
    }
});

router.get('/login', async(req, res) => {
    try {
        // checking if the user already exits in the database or not
        var user = await User.findOne({ email: req.body.email }).exec();
        // exec function is used to execute a query if it normally doesn't works.Mostly needed with the promises
        if (user != null) {
            // here bcrypt.compare function checks the password entered byt fronted is the same as saved in the database or not.
            let loginCheck = await bcrypt.compare(req.body.password, user.password);
            if (loginCheck) {
                // if both pass matches then a token will be generated and the user will be logged in
                let token = await generateJwt(user._id);
                res.json({ message: "Logged In Successfully", data: token, success: true })
                res.send("hey hey we are logged in");
                // res.json(token);
            } else {
                res.json({ message: "Password Does not match", success: false });
            }
        } else {
            res.json({ message: "User Not Found" });
        }
        // res.json('Login Successful');
    } catch (err) {
        console.log(err);
        res.json({ message: err.message, success: false });
    }
})

// BACKEND ENDS HERE

module.exports = router;