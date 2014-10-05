
/*
 * GET home page.
 */

module.exports = function(app) {
	app.get('/tests', function(req, res) {
  		res.render('home', { layout: 'jasmine-tests' });
	});
};
