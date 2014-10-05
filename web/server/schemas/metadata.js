var mongoose = require('mongoose');

var MetaData = new mongoose.Schema({
  searchValue: {type:String, required: true, unique:true},
  description: {type: String, required:true},
  type: {type: String, required:true}
});

module.exports = MetaData;


