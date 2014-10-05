// SERVER SIDE TEST SUITE
require('../../config/test_config');
var request = require('superagent'),	
	config = require('../../config/config').config,
	mongoose = require('mongoose');
	expect = require('expect.js'),
	BlogPostModel = require('../../models/blog_post'),
	CommentModel = require('../../models/comment'),
	TriviaModel = require('../../models/trivia'),
	UserModel  = require('../../models/user')
	app = require('../../server.js'),
	http = require('http');
	async = require('async');
	
function cleanDB(db){
	// console.log('------ CLEANING DB----------');
	db.collections.comments.remove({}, function(){});
	db.collections.trivias.remove({}, function(){});
	db.collections.users.remove({}, function(){});
	db.collections.blogposts.remove({}, function(){});
}

var dbUri = process.env.DB_URL;
var db = mongoose.connection;

/*
*-----------------------------------
* AUTH API
* METHODS: GET | POST | PUT | DELETE
*-------------------------------------
*/
describe('GET /api/auth', function(){
	before(function(){
		server = http.createServer(app).listen(3000);
	});
	
	beforeEach(function(){
		cleanDB(db);
	});
	
	after(function(done){
		cleanDB(db);
		server.close(done);
	});

	it('Should return 200', function(done) {
		request.get('localhost:2000/api/auth').end(function(res) {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			done();
		});
	});

});
