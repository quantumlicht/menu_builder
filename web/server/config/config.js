// CONFIG
// ======
var winston = require('winston');
exports.config = {
  listenPort: "2000",
  ROOT_URL: 'menage#',
  sessionSecret: 'bb-login-secret',
  cookieSecret: 'bb-login-secret',
  cookieMaxAge: (1000 * 60 * 60 * 24 * 365),
  database: {
    IP: "localhost",
    name: "menu_builder",
    port: "27017",
  	db_connection:'mongodb://heroku:AloGHq0Fn6r10viV2ZLD_AvDlrzCHHjtv10HIN2hof_9YPhc2PWPRW8G3ZRc5E1i1_xSpjxHgQBfT9ucgN2Nfw@kahana.mongohq.com:10076/app29054970',
    local_db:'mongodb://localhost:27017/menu_builder'
  }
};


exports.logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'access.log', colorize:false, json:false})
    ]
});

exports.env_config = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return {
              domain: "app29054970.auth0.com",
              clientID: "mYCYA7UsTqePSwzJvKjrYx9GRbD3dF0U",
              callbackURL: "http://localhost:2000/menage/callback",
              clientSecret: 'TtFYb6CRVYO4fZTdSfRcyAhTdQNt43ycf8OsOUoi0SBloblAYz9zfVL2TioHiutp',
              redirectUri: "http://localhost:2000/menage/callback"
            };

        case 'production':
            return {
              domain: "app29054970.auth0.com",
              clientID: "mYCYA7UsTqePSwzJvKjrYx9GRbD3dF0U",
              callbackURL: "http://chores-tracker.herokuapp.com/menage/callback",
              clientSecret: 'TtFYb6CRVYO4fZTdSfRcyAhTdQNt43ycf8OsOUoi0SBloblAYz9zfVL2TioHiutp',
              redirectUri: "http://chores-tracker.herokuapp.com/menage/callback"
            };

        case 'test': 
          return {
            domain: "app29054970.auth0.com",
            clientID: "mYCYA7UsTqePSwzJvKjrYx9GRbD3dF0U",
            callbackURL: "http://localhost:2000/menage/callback",
            clientSecret: 'TtFYb6CRVYO4fZTdSfRcyAhTdQNt43ycf8OsOUoi0SBloblAYz9zfVL2TioHiutp',
            redirectUri: "http://localhost:2000/menage/callback"
          }

        default:
            return {error: 'Unknown or no environment specified'};
    }
};

