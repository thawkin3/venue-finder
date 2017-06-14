var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
var Rsvp = require('../models/rsvp.js');

var request = require("request");

// Yelp info
var grant_type = "client_credentials";
var client_id = "DUZCUdDpUkO-JcNJfX-DHw";
var client_secret = "MrJrT9GCWghK879AoYMb6hJ6VbmE3NbPeJ2RtlXzPrka4HXY8KwGAQoHEqDz5ymc";
var authToken = "Bearer rwPrY83DcCpidIo6G72j7gJiS4pa_w2MBaijeQK_zYOglWFpifuHWkacn01Ap7LdXrfB00YGREfRhFx9l5AqCfASvi67uiUk3iHnFhyX1BBU3dmzGQvQAERoKwIzWXYx";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root:  'public' });
});

/* Set up mongoose in order to connect to mongo database */
// Adds mongoose as a usable dependency
var mongoose = require('mongoose');

// Connects to a mongo database called "venueFinderDB"
mongoose.connect('mongodb://localhost/venueFinderDB');

// Saves the connection as a variable to use
var db = mongoose.connection;
// Checks for connection errors
db.on('error', console.error.bind(console, 'connection error:'));
// Lets us know when we're connected
db.once('open', function() {
  console.log('Connected');
});


// Register a new user
router.post('/api/v1/users/register', function(req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!',
        username: req.user.username
      });
    });
  });
});

// Login
router.post('/api/v1/users/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: 'Username or password is incorrect'
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!',
        username: req.user.username
      });
    });
  })(req, res, next);
});

// Logout
router.get('/api/v1/users/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

// Get login status
router.get('/api/v1/users/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false,
      username: null
    });
  }
  res.status(200).json({
    status: true,
    username: req.user.username
  });
});


// Get Yelp Auth Token
router.post('/getAuthToken', function(req, res, next) {

    // Query the Yelp API and return the auth token
    request({
      uri: "https://api.yelp.com/oauth2/token",
      method: "POST",
      headers: {
            "content-type": "application/x-www-form-urlencoded"
      },
      form: {
            grant_type: grant_type,
            client_id: client_id,
            client_secret: client_secret
      },
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10,
      json: true
    }, function(err, response, body) {
        if (err) return console.error(err);
        // console.log(body);
        // res.status(200).json(body);
        res.status(200).json(body.access_token);
    });

});

// Search the Yelp API
router.get('/search', function(req, res, next) {
    var theLocation = req.query.location;
    var theSearchTerm = req.query.searchTerm;

    // Query the Yelp API and return the search results
    request({
      uri: "https://api.yelp.com/v3/businesses/search?location=" + theLocation + "&term=" + theSearchTerm,
      method: "GET",
      headers: {
            Authorization: authToken
          },
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10
    }, function(err, response, body) {
        if (err) return console.error(err);
        // console.log(JSON.parse(body));
        res.status(200).json(JSON.parse(body));
    });

});


// GET RSVPs for a Venue
router.get('/rsvp/:venueID', function(req, res, next) {
    var query = Rsvp.find({ venueID: req.params.venueID });
    query.exec(function(err, rsvps) {
        // If there's an error, print it out
        // if (err) return console.error(err);
        if (err) {
          res.sendStatus(500);
        // Otherwise, return all the rsvps for that venue
        } else {
            res.status(200).json(rsvps);
        }

    });
});

// POST a new RSVP for a Venue
router.post('/rsvp/:venueID', function(req, res, next) {
    console.log(req.body);

    var query = Rsvp.find({ venueID: req.params.venueID, user: req.body.user });
    query.exec(function(err, rsvps) {
        if (err) {
          res.sendStatus(500);
        // Otherwise, return all the rsvps for that venue
        } else {
            var okToRsvp = true;
            if (rsvps.length > 1) {
              // console.log(rsvps);
              // console.log(rsvps.length);
              // console.log(req.body.timestamp);
              // console.log(rsvps[0].timestamp);
              for (var i = 0; i < rsvps.length; i++) {
                console.log(req.body.timestamp - rsvps[0].timestamp);
                if (req.body.timestamp - rsvps[0].timestamp < 86400000) {
                  okToRsvp = false;
                  break;
                }
              }
            }

            if (okToRsvp) {
              var newRsvp = new Rsvp(req.body);
              console.log(newRsvp);
              
              newRsvp.save(true, function(err, post) {
                  // if (err) return console.error(err);
                  if (err) res.sendStatus(500);
                  console.log(post);
                  // res.sendStatus(200);
                  res.status(200).json(post);
              });
            } else {
                res.sendStatus(200);
            }
        }

    });

    
});


/* route all other traffic to the home page. */
router.get('*', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
