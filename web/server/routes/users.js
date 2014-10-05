var User = require('../models/user');
var Config = require('../config/config').config;
var notLoggedIn = require('./middleware/not_logged_in');
var _ = require('underscore');
var loadUser = require('./middleware/load_users');
var restrictUserToSelf = require('./middleware/restrict_user_to_self');
var async = require('async');

var request = require('superagent');

module.exports = function(server) {

	function getAccessToken(callback) {
		return request.post(Config.auth0_api.token_uri)
		.send({	
			client_id : Config.auth0_api.api_id,
			client_secret: Config.auth0_api.api_secret,
			grant_type: 'client_credentials'
		})
		.set('Content-Type', 'application/json')
		.end(function(err, res) {

			if(!err) {
				callback(res.body.access_token); 
			}
		});
	}

	server.get('/users', function(req, resp, next) {
		getAccessToken(function(token) {
			request.get(Config.auth0_api.users_uri)
			.set('Authorization', 'Bearer ' + token)
			.end(function(err, res) {
				if(!err) {
					resp.json(res.body);
				}
				else {
					console.error(err);
				}
			});
		});

	});

	server.get('/users/:user_id', function(req, res, next) {
		async.parallel(
			{
				user: function(next) {
					getAccessToken(function(token) {
						request.get(Config.auth0_api.users_uri + '/' + req.params.user_id)
						.set('Authorization', 'Bearer ' + token)
						.end(function(err, res) {
							next(err, res.body);
						});
					});
					// User.findOne({user_id: req.params.user_id}).exec(next);
				},
				comments: function(next) {
					Comment.find({user_id: req.params.user_id}).exec(next);
				},
				trivias: function(next) {
					Trivia.find({user_id: req.params.user_id}).exec(next);
				}	
			},
			function(err, results) {
				if(err){
					return next(err);
				}
				// console.log('/users/:user_id', 'results', results);

				var data = {
					users: results.user,
					comments: results.comments,
					trivias: results.trivias
				}
				// console.log('GET /users/:username','username:', req.params.username,'data', data);
				res.send(data);
			}
		);
	});

	server.post('/users', function(req, res) {
		var user = new User({
			username: req.body.username,
			password: req.body.password
		});
		return user.save(function(err) {
			if (!err) {

				console.log('User created', user);
				return res.send(user);
			}
			else {
				if (err.code === 11000) {
					res.send('Conflict', 409);
				}
				console.log(err);	
			}
		});
		// User.create(req.body, function(err){
		// 	if (err) {
		// 		if (err.code === 11000) {
		// 			res.send('Conflict', 409);
		// 		}
		// 		else {
		// 			if (err.name === 'ValidationError') {
		// 				return res.send(Object.keys(err.errors).map(function(errField) {
		// 					return err.errors[errField].message;
		// 				}).join('. '), 406);
		// 			}
		// 			else {
		// 				next(err);
		// 			}
		// 		}
		// 		return;
		// 	}
		// 	res.redirect('/users');			
		// });
	});

	server.del('/users/:name', loadUser, restrictUserToSelf, function(req, res, next) {
		req.user.remove(function(err) {
			if (err) { return next(err); }
			res.redirect('/users');
		});
	});
};