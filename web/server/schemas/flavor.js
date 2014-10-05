var mongoose = require('mongoose');

var FlavorSchema = new mongoose.Schema({
  name: {type: String, required: true},
  intensity: {type: Number, required:true}
});


module.exports = FlavorSchema;


