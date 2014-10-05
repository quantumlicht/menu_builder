var RecipeModel = require('../models/recipe');
var paginateRecipes = require('./middleware/paginate_recipes');

module.exports = function(server) {

	server.get('/recipes/:course', paginateRecipes, function(req, res) {
		// console.log('GET /recipes/:course', req.params.course);
		RecipeModel.find({course:req.params.course}, function(err, recipes) {
			if (typeof res.recipes_payload !== 'undefined') {
				console.log('GET /recipes/:course', 'payload', req.params.course);
				res.json(res.recipes_payload, 200);
			}
			else {
				res.send('No results');
			}
		});
	});

	server.get('/recipes', paginateRecipes, function(req, res) {
		if (typeof res.recipes_payload !== 'undefined') {
			console.log('GET /recipes');
			res.json(res.recipes_payload, 200);
		} 
		else {
			res.send('No results');	
		}
	});


	server.post('/recipes', function(req, res) {
		console.log('flavors', req.body.flavors.length, 'nutrients', req.body.nutrients.length, 'totalTimeInSeconds', req.body.totalTimeInSeconds);
		RecipeModel.create(req.body, function(err){
			if (err) {
				if (err.code === 11000) {
					console.log('POST /recipe id:', req.body.id,'already stored');
					return res.send('Conflict', 409);
				}
				else {
					if (err.name === 'ValidationError') {
						console.log('POST /recipe id:', req.body.id,'did not validate');
						return res.send(Object.keys(err.errors).map(function(errField) {
							return err.errors[errField].message;
						}).join('. '), 406);
					}
				}
				console.log(err);
				return;
			}
			else {
				console.log('POST /recipe id:', req.body.id,'created');
				res.json({ recipe: req.body});   
			}
		});
	});
}