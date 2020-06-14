require('dotenv').config()
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const generateJwt = async(id) => {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        id: id,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
}

const verifyToken = async(req, res, next) => {
    try {
        let tokenExist = req.body.token
        if (tokenExist) {
            const verifyJwt = jwt.verify(tokenExist, process.env.SECRET);
            req.tokenConfig = verifyJwt;
            next();
        } else {
            res.json({ message: "Token Not Found" });
        }
    } catch (err) {
        res.json({ message: "code not works" });
    }
}


module.exports = { generateJwt, verifyToken }