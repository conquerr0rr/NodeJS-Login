var express = require('express');
var mongoose = require('mongoose');

var User = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    phone: String
});


module.exports = mongoose.model('User', User);