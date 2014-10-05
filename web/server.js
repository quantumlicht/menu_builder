// DEPENDENCIES
// ============

var  url = require('url'),
express  = require("express"),
http     = require("http"),
port     = 2000,
mongoose = require('mongoose'),
server   = module.exports = express();
// DATABASE CONFIGURATION
// ======================
var database =  {
    host: "localhost",
    name: "menu_builder",
    port: "27017"
};

var db_connection = 'mongodb://' +  database.host + ':' + database.port + '/' + database.name;


// Connect to Database
mongoose.connect(db_connection);



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function callback () {
  console.log('Connected to ' + database.name);
});


// SERVER CONFIGURATION
// ====================

server.enable('trust proxy');

server.set('local', function(){
    server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
server.set('development', function(){
    server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
server.set('production', function(){
    server.use(express.errorHandler());
});


server.post('/:type/:id', function(req, res){
    res.send('hello');
  });

server.set(function() {
  
  server.use(express.errorHandler({

    dumpExceptions: true,

    showStack: true

  }));


  server.use( express.compress() );
  
  server.use( express.urlencoded() );            // Needed to parse POST data sent as JSON payload
  
  server.use( express.json() );
  
  server.use(express.bodyParser());

  server.use(express.methodOverride());

  server.use(passport.initialize());
  
  server.use(passport.session());
  
  server.use(server.router);

});

// API
// ===
require('./routes/metadata')(server);

// Start Node.js Server
http.createServer(server).listen(port);

