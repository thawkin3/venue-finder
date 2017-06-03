var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// Defines the User Schema for this database
var userSchema = mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

// Makes an object from that schema as a model
module.exports = mongoose.model('User', userSchema);