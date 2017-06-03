var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

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

router.get('/api/v1/users/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

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

/* POST a new poll */
// router.post('/api/v1/polls', function(req, res, next) {
//   console.log("POST create poll route");
//   console.log(req.body);

//   var newPoll = new Poll(req.body);
//   console.log(newPoll);
//   console.log(req.body.Poll);
  
//   newPoll.save(true, function(err, post) {
//     // if (err) return console.error(err);
//     if (err) res.sendStatus(500);
//     console.log(post);
//     // res.sendStatus(200);
//     res.json(post);
//   });
// });

/* GET all polls for a user */
// router.get('/api/v1/polls/:username', function(req, res, next) {
// 	console.log("GET polls route");
// 	var query = Poll.find({ username: req.params.username }).sort({ questionText: 1 });
// 	query.exec(function(err, polls) {
// 			// If there's an error, print it out
// 			// if (err) return console.error(err);
// 			if (err) {
// 				res.sendStatus(404);
// 			// Otherwise, return all the polls for that user
// 			} else {
// 			    res.json(polls);
// 			}

// 	});
// });

/* GET a single poll for a user */
// router.get('/api/v1/polls/:username/:pollId', function(req, res, next) {
// 	console.log("GET single poll route");
// 	var query = Poll.findOne({ username: req.params.username, _id: req.params.pollId });
// 	query.exec(function(err, poll) {
// 			// If there's an error, print it out
// 			// if (err) return console.error(err);
// 			if (err) {
// 				res.sendStatus(404);
// 			// Otherwise, return the single poll for that user
// 			} else {
// 			    res.json(poll);
// 			}

// 	});
// });

/* PUT a single poll for a user to update that poll */
/* ALSO */
/* PUT a single poll for a participant to vote on that poll */
// router.put('/api/v1/polls/:username/:pollId', function(req, res, next) {
// 	console.log("PUT single poll route");
// 	var query = Poll.findOne({ username: req.params.username, _id: req.params.pollId });
// 	query.exec(function(err, updatedPoll) {
// 			// If there's an error, print it out
// 			// if (err) return console.error(err);
// 			if (err) {
// 				res.sendStatus(404);
// 			// Otherwise, update the single poll for that user
// 			} else {
// 				if (req.body.question != undefined) updatedPoll.question = req.body.question;
// 				if (req.body.choices != undefined) updatedPoll.choices = req.body.choices;
// 				if (req.body.username != undefined) updatedPoll.username = req.body.username;
// 				if (req.body.votes != undefined) updatedPoll.votes = req.body.votes;
// 				if (req.body.totalVotes != undefined) updatedPoll.totalVotes = req.body.totalVotes;
// 				if (req.body.allowNewChoices != undefined) updatedPoll.allowNewChoices = req.body.allowNewChoices;
// 				updatedPoll.save(true, function(err, put) {
// 				    if (err) return console.error(err);
// 				    console.log(put);
// 				    res.sendStatus(200);
// 				});
// 			}

// 	});
// });

/* DELETE a single poll for a user */
// router.delete('/api/v1/polls/:username/:pollId', function(req, res, next) {
// 	console.log("DELETE single poll route");
// 	var query = Poll.remove({ username: req.params.username, _id: req.params.pollId });
// 	query.exec(function(err) {
// 			// If there's an error, print it out
// 			// if (err) return console.error(err);
// 			if (err) {
// 				res.sendStatus(500);
// 			// Otherwise, delete the single poll for that user
// 			} else {
// 				res.sendStatus(200);
// 			}

// 	});
// });

/* route all other traffic to the home page. */
router.get('*', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
