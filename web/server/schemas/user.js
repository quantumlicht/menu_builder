var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String, required:true},
    auth_token: {type: String, unique:true},	
    creationDate: {type: Date, required:true, default: new Date()}
});

module.exports = UserSchema;