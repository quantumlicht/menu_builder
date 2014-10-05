var mongoose = require('mongoose');

var RecipeSchema = require('../schemas/recipe');

var Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
