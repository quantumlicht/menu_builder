Recipe = require('../../models/recipe');

var default_max_result = 25;
function paginateRecipes(req, res, next) {
	// first page is 1;
	var page = req.query.page && parseInt(req.query.page, 10) || 1;
	var max_result = req.query.max_result && parseInt(req.query.max_result, 10) || default_max_result;
	req_params = {};
	for (param in req.params) {
		req_params[param] = req.params[param];
	}
	Recipe.count(req_params, function(err, count) {
		console.log('count', count);
		if (err) {
			console.err('Error', err);
			return next(err);
		}
		var lastPage = page * max_result >= count;
		console.log('max_result', max_result, 'page', page, 'params', req.params, 'lastPage', lastPage);
		Recipe.find(req_params)
		.skip((page - 1) * max_result)
		.limit(max_result)
		.exec(function(err, recipes) {
			if (err) {
				console.err('Error', err);
				return next(err);
			}
			res.recipes_payload = {recipes: recipes, currentPage:page, lastPage:lastPage};
			next();
		});
	});
}

module.exports = paginateRecipes;
