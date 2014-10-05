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
* COMMENTS API
* METHODS: GET | POST | PUT | DELETE
*-------------------------------------
*/


/*
GET
*/
describe('GET /comments', function(){
	before(function(){
		server = http.createServer(app).listen(3000);
	});
	
	beforeEach(function(done){
		cleanDB(db);
		comment_a = new CommentModel({
			username: 'username',
    		user_id: '12345abde',
    		content: 'content',
    		modelUrl: 'modelUrl',
    		modelId: 'modelId'
		});
		comment_b = new CommentModel({
			username: 'username-b',
    		user_id: '12345abssde',
    		content: 'content-b',
    		modelUrl: 'modelUrl-b',
    		modelId: 'modelId-b'
		});
		async.series([
			function(cb){
				request.post('localhost:2000/comments').send(comment_a).end(function(err, res){
					cb(null,res);
				});
			},
			function(cb){
				request.post('localhost:2000/comments').send(comment_b).end(function(err, res){
					cb(null,res);
				});
			}
		],
		function(err, res){
			done();
		});
	});
	
	after(function(done){
		cleanDB(db);
		server.close(done);
	});

	it('should return all comments', function(done){
		request.get('localhost:2000/comments').end(function(err, res){
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body.length).to.be(2);
			expect(res.body[0].username).to.be('username');
			expect(res.body[1].username).to.be('username-b');
			done();
		})
	});
});
/*
POST
*/
describe('POST /comments', function(){
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
	it('should return the created comment', function(done){
		comment_a = new CommentModel({
			username: 'username',
    		user_id: '12345abde',
    		content: 'content',
    		modelUrl: 'modelUrl',
    		modelId: 'modelId'
		});
		request.post('localhost:2000/comments').send(comment_a).end(function(err, res){
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body.user_id).to.be('12345abde');
			expect(res.body.username).not.to.be('wrong-username');
			expect(res.body.username).to.be('username');
			expect(res.body.content).to.be('content');
			expect(res.body).to.have.key('commentDate');
			expect(res.body).to.have.key('_id');
			expect(res.body.modelId).to.be('modelId');
			expect(res.body.modelUrl).to.be('modelUrl');
			done();
		});
		it('should make sure the user_id exists or matches the username provided');
		it('should make sure the username exist');
		it('should make make sure all fields are passed correctly');
	});
});
/*
PUT
*/
describe('PUT /comments', function(){
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

	var comment = new CommentModel({
		username: 'username',
		user_id: '12345abde',
		content: 'content',
		modelUrl: 'modelUrl',
		modelId: 'this model id'
	});
	it('Should modify the comment', function(done){
		async.waterfall([
			function(cb){
				request.post('localhost:2000/comments').send(comment).end(function(err, res){
					cb(null, res.body);
				});
			},
			function(model, cb){
				model.content = 'edited-content';
				model.username = 'edited-username';
				model.modelUrl = 'modelUrl-edited';
				request.put('localhost:2000/comments/'+ model._id).send(model).end(function(res){
					cb(null, res);
				});	
			}
		], function(err, res){
			console.log('body', res.body);
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body).to.not.be.empty();
			expect(res.body.username).not.to.be('wrong-username');
			expect(res.body.username).to.be('edited-username');
			expect(res.body.content).to.be('edited-content');
			expect(res.body.modelUrl).to.be('modelUrl-edited');
			expect(res.body.modelId).to.be('this model id');
			expect(res.body).to.have.key('commentDate');
			expect(res.body).to.have.key('_id');
			done();
		});
	});
});
/*
DELETE
*/
describe('DELETE /comments', function(){
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

	var comment = new CommentModel({
		username: 'username',
		user_id: '12345abde',
		content: 'content',
		modelUrl: 'modelUrl',
		modelId: 'this model id'
	});
	
	it('should delete the comment', function(){
		async.waterfall([
			function(cb) {
				request.post('localhost:2000/comments').send(comment).end(function(err, res){
					CommentModel.count(function(err, cnt){
						expect(cnt).to.be(1);
						cb(null, res.body);
					});

				});
			},
			function(model, cb) {
				request.del('localhost:2000/comments/'+ model._id).end(function(res) {
					CommentModel.count({}, function(err, cnt){
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
				CommentModel.count({}, function(err, cnt){
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
