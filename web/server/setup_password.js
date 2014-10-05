var passport = require('passport');
var config = require('./config/config').env_config();
var Auth0Strategy  = require('passport-auth0');
var strategy = new Auth0Strategy({
    domain: config.domain,
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL
  }, function(accessToken, refreshToken, profile, done) {
    //Some tracing info
    // console.log('profile is', profile);
    //save the profile
    return done(null, profile);
  });

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
module.exports = strategy;


