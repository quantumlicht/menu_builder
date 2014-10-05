var mongoose = require('mongoose');
var flavor = require('./flavor');
var metadata = require('./metadata');
var nutrient = require('./nutrient');
function ingredientValidator (val) {
	return val.type === 'ingredient';
}

var RecipesSchema = new mongoose.Schema({
	id: {type: String, unique:true, required:true},
	recipeName: String,
	course: String,
	flavors: [{	
		name: String,
  		intensity: Number
	}],
	rating: Number,
	ingredients: [String],
	nutrients: [{
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
	}],
  	totalTimeInSeconds: Number,
  	recipeUrl: String,
  	imageUrl: String,
  	numberOfServings: Number
});


module.exports = RecipesSchema;


