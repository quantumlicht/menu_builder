// DEPENDENCIES
// ============
var logger = require('./config/config').logger;
var setup_password = require('./setup_password');
var passport = require('passport');
var Config =  global.Config = require('./config/config').config,
    env_config = require('./config/config').env_config(),
    url = require('url'),
    express = require("express"),
    bcrypt = require("bcrypt-nodejs"),
    _ = require("underscore"),
    http =    require("http"),
    exphbs = require('express3-handlebars'),
    path = require('path'),
    port =    ( process.env.PORT || Config.listenPort ),
    mongoose =     require('mongoose'),
    server =  module.exports = express(),
    request = require('request');
// DATABASE CONFIGURATION
// ======================
  
// Connect to Database
dbUri = process.env.MONGOHQ_URL || Config.database.local_db;
mongoose.connect(dbUri);



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function callback () {
  console.log('Connected to ' + Config.database.name);
});



// SERVER CONFIGURATION
// ====================

server.enable('trust proxy');

server.configure('local', function(){
    server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
server.configure('development', function(){
    server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
server.configure('production', function(){
    server.use(express.errorHandler());
});

// server.configure (function () {
  // his.use(express.cookieParser());
//   // this.use(express.session({secret: 'foo'}));


server.configure(function() {
  
  server.set('views', path.join(__dirname, '/views'));
  
  server.engine('handlebars', exphbs({
    defaultLayout:'main',
    layoutsDir: server.get('views') + '/layouts'
  }));

  server.set('view engine', 'handlebars');
  
  server.use('/', express.static(path.join(__dirname + "./../public")));
  server.use('/tests', express.static(path.join(__dirname + "./../public")));

  server.use(express.errorHandler({

    dumpExceptions: true,

    showStack: true

  }));


  server.use( express.compress() );
  
  server.use( express.urlencoded() );            // Needed to parse POST data sent as JSON payload
  
  server.use( express.json() );
  
  server.use(express.bodyParser());

  server.use(express.methodOverride());

  server.use( express.cookieParser( Config.cookieSecret ) );           // populates req.signedCookies
  
  server.use( express.cookieSession( Config.sessionSecret ) );  
  
  server.use(passport.initialize());
  
  server.use(passport.session());
  // server.use(server.router);
  // console.log('env_config', env_config);
  // /* For passing environment variables inside the templates*/
  // // server.locals.env = {loco:'motive'};
  // // process.env['passport'] = JSON.stringify(env_vars.passport);
  server.set('env', JSON.stringify(env_config));

});


// API
// ===
require('./routes/auth')(server);
require('./routes/metadata')(server);
require('./routes/recipes')(server);
require('./routes/dailyintake')(server);
require('./routes/tests')(server);
require('./routes/users')(server);
require('./routes/index')(server);

// Start Node.js Server
http.createServer(server).listen(port);
