require('dotenv').config();
const jwt = require('jsonwebtoken');


const secret = "skldfdl";

function createToken(user) {
    payload = {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role
    }

    const token = jwt.sign(payload, secret);
    return token;
}


function verifyToken(token) {
    const data = jwt.verify(token, secret);
    return data;
}

function verifyUser(req, res, next) {
    if(!req.cookies.token) {
        return next();
    }

    const data = verifyToken(req.cookies.token);
    req.user = data;
    // console.log(req.user)
    next();
}

module.exports = {
    createToken,
    verifyToken,
    verifyUser
}