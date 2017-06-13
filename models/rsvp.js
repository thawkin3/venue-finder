var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// Defines the Rsvp Schema for this database
var rsvpSchema = mongoose.Schema({
  venueID: String,
  user: String,
  timestamp: Date
});

// rsvpSchema.plugin(passportLocalMongoose);

// Makes an object from that schema as a model
module.exports = mongoose.model('Rsvp', rsvpSchema);