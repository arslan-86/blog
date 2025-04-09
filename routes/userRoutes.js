const express = require('express');
const User = require('../models/user.js')

const router = express.Router();



router.route('/login')
.get((req, res) => {
    return res.render('login.ejs')
})
.post(async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswords(email, password);
        return res.cookie("token", token).redirect('/');
    } catch (err) {
        return res.render('login', {
            error: err.message
        });
    }
    
})


router.route('/signup')
.get((req, res) => {
    return res.render('signup.ejs');
 })
.post( async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password
    })
    return res.redirect('/login');
})


router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

 module.exports = router