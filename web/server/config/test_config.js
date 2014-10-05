var config = require('./config').config;
process.env.NODE_ENV = 'test';
process.env.DB_URL = 'mongodb://' + config.database.IP + ':' + config.database.port + '/' + config.database.name;