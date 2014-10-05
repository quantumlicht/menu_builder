var mongoose = require('mongoose');
var NutrientSchema = new mongoose.Schema({
  	attribute: String,
  	description: String,
  	value: Number,
  	unit: {
  		name: String,
  		abbreviation: String,
  		plural: String,
  		pluralAbbreviaton: String,
  		decimal: Boolean
	}
});


module.exports = NutrientSchema;


