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
// mongoose.connect(dbUri);
var db = mongoose.connection;

/*
*-----------------------------------
* BLOGPOSTS API
* METHODS: GET | POST | PUT | DELETE
*-------------------------------------
*/

/*
GET
*/
describe('GET /blogposts', function(){
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
		request.get('localhost:2000/blogposts').end(function(res){
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			done();
		});
	});

	it('Should return some blogpost models', function(done) {
		request.get('localhost:2000/blogposts').end(function(res){
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body.length).to.be(0);
			done();
		});
	});
});

/*
POST
*/
describe(' POST /blogposts', function() {
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
	it('should return the created post', function(done) {
		blogpost = new BlogPostModel({
		  	title: 'test-title',
		  	user_id: 'user-id',
		  	username: 'test-username',
			content: 'test-content',
			postDate: new Date('2014-12-12 00:00:00')
		});
		request.post('localhost:2000/blogposts').send(blogpost).end(function(res) {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body).to.not.be.empty();
			expect(res.body.title).to.be('test-title');
			expect(res.body.user_id).to.be('user-id');
			expect(res.body.username).not.to.be('wrong-username');
			expect(res.body.username).to.be('test-username');
			expect(res.body.content).to.be('test-content');
			expect(res.body).to.have.key('postDate');
			expect(res.body).to.have.key('_id');
		});

		request.get('localhost:2000/blogposts').end(function(res) {
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body.length).to.be(1);
			done();
		});
	});

	it('Should have unique title', function(done) {
		blogpost = new BlogPostModel({
		  	title: 'test-title',
		  	user_id: 'user-id',
		  	username: 'test-username',
			content: 'test-content',
			postDate: new Date('2014-12-12 00:00:00')
		});

		request.post('localhost:2000/blogposts').send(blogpost).end(function(){
			request.post('localhost:2000/blogposts').send(blogpost).end(function(res) {
				expect(res.statusCode).to.be(409);
				done();
			});
			
		});
	});
	it('should make sure the user_id exists or matches the username provided');
	it('should make sure the username exist');
	it('should make make sure all fields are passed correctly');
});

/*
PUT
*/
describe(' PUT /blogposts', function(){
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
	var blogpost = new BlogPostModel({
	  	title: 'test-title',
	  	username: 'test-username',
	  	user_id: 'user-id',
		content: 'test-content',
		postDate: new Date('2014-12-12 00:00:00')
	});

	it('Should modify the blogpost', function(done){
		async.waterfall([
			function(cb){
				request.post('localhost:2000/blogposts').send(blogpost).end(function(err, res){
					cb(null, res.body);
				});
			},
			function(model, cb){
				model.title = 'edited-title';
				model.username = 'edited-username';
				request.put('localhost:2000/blogposts/'+ model._id).send(model).end(function(res){
					cb(null, res);
				});	
			}
		], function(err, res){
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body).to.not.be.empty();
			expect(res.body.title).to.be('edited-title');
			expect(res.body.username).not.to.be('wrong-username');
			expect(res.body.username).to.be('edited-username');
			expect(res.body.content).to.be('test-content');
			expect(res.body).to.have.key('postDate');
			expect(res.body).to.have.key('_id');
			done();
		});
	});
});

/*
DELETE
*/
describe('DELETE /blogpost', function(){
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
	
	var blogpost = new BlogPostModel({
	  	title: 'test-title',
	  	username: 'test-username',
	  	user_id: 'user-id',
		content: 'test-content',
		postDate: new Date('2014-12-12 00:00:00')
	});

	it('Should delete the blogpost', function(done){
		async.waterfall([
			function(cb) {
				request.post('localhost:2000/blogposts').send(blogpost).end(function(err, res){
					BlogPostModel.count({}, function(err, cnt){
						expect(cnt).to.be(1);
						cb(null, res.body);
					});

				});
			},
			function(model, cb) {
				request.del('localhost:2000/blogposts/'+ model._id).end(function(res) {
					BlogPostModel.count({}, function(err, cnt){
						expect(cnt).to.be(0);
						cb(null, res);
					});
				});	
			}
		], function(err, res){
			if (!err) {
				expect(res).to.exist;
				expect(res.status).to.equal(200);
				expect(res.body).to.not.be.empty();
				BlogPostModel.count({}, function(err, cnt){
					expect(cnt).to.be(0);
					done();
				});
			}
			else {
				console.log('Uncaught error: ' + err);
			}
		});	
	});
});
