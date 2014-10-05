var User = require('../models/user');
var _ = require('underscore');
var bcrypt = require("bcrypt-nodejs");
var Config = require('../config/config').config;
var logger = require('../config/config').logger;
var passport = require('passport');
module.exports = function(server) {

	server.get('/menage/callback', 
  		passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }), 
		function(req, res) {
    		if (!req.user) {
      			throw new Error('user null');
    		}
    		console.log('req.user', req.user);
    		res.cookie('profile', req.user._json,  { signed: true, maxAge: Config.cookieMaxAge  });
    		res.redirect(Config.ROOT_URL);
  		}
	);

	server.get("/menage/api/auth", function(req, res){
		// logger.info('GET /api/auth', 'req.signedCookies', req.signedCookies['connect.sess'].passport.user);
		// var user = req.signedCookies['connect.sess'].passport.user;
		// logger.info('GET /api/auth', 'user_id', req.signedCookies.user_id);
		res.json({user: req.signedCookies.profile});
	    // User.findOne({_id:req.signedCookies.user_id, auth_token: req.signedCookies.auth_token}, function(err, user){
	    //     if(user){
	    //         res.json({ user: _.pick(user, ['username', '_id']) });   
	    //     } else {  
	    //         res.json({ error: "Client has no valid login cookies."});   
	    //     }
	    // });
	});


	server.post("/menage/api/auth/login", function(req, res){
	    User.findOne({username: req.body.username}, function(err, user){
	        if(user){

	            // Compare the POSTed password with the encrypted db password
	            if( bcrypt.compareSync( req.body.password, user.password)){
	                res.cookie('user_id', user._id, { signed: true, maxAge: Config.cookieMaxAge  });
	                res.cookie('auth_token', user.auth_token, { signed: true, maxAge: Config.cookieMaxAge  });

	                // Correct credentials, return the user object
	                res.json({ user: _.pick(user, ['username', '_id']) });   
	                
	            } else {
	                // Username did not match password given
	                res.json({ error: "Invalid username or password."  });   
	            }
	        } else {
	            // Could not find the username
	            res.json({ error: "Username does not exist."  });   
	        }
	    });
	});

	// POST /menage/api/auth/signup
	// @desc: creates a user
	server.post("/menage/api/auth/signup", function(req, res){
		console.log('signup', req.body);
		var user = {
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password),
			auth_token: bcrypt.genSaltSync(8)
		};
		User.create(user, function(err, user){
			if (err) {
				console.log(err)
				if (err.code === 11000) {
					logger.info('POST /menage/api/auth/signup', 'Conflict', 409);
					res.send('Conflict', 409);
				}
				else {
					if (err.name === 'ValidationError') {
						logger.info('POST /menage/api/auth/signup', 'ValidationError');
						return res.send(Object.keys(err.errors).map(function(errField) {
							return err.errors[errField].message;
						}).join('. '), 406);
					}
				}
				return;
			}
			else {
				logger.info('POST /api/auth/signup', 'User created');
				res.cookie('user_id', user.id, { signed: true, maxAge: Config.cookieMaxAge  });
            	res.cookie('auth_token', user.auth_token, { signed: true, maxAge: Config.cookieMaxAge  });
            	res.json({ user: _.omit(user, ['password', 'auth_token']) });   
				// next(err);
			}
			// res.redirect('/users');			
		});
	});

	// POST /api/auth/logout
	// @desc: logs out a user, clearing the signed cookies
	server.post("/menage/api/auth/logout", function(req, res){
    	res.clearCookie('user_id');
    	res.clearCookie('auth_token');
    	res.clearCookie('profile');
    	res.json({ success: " successfully logged out." });
	});

	// POST /api/auth/remove_account
	// @desc: deletes a user
	server.post("/menage/api/auth/remove_account", function(req, res){
    User.remove({_id:req.signedCookies.user_id, auth_token:req.signedCookies.auth_token}, function(err){
        if(err){ 
            res.json({ error: "Error while trying to delete user." });
        } else {
            res.clearCookie('user_id');
            res.clearCookie('auth_token');
            res.json({ success: " successfully deleted." });
        }
    });
});
	
};