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
* trivia API
* METHODS: GET | POST | PUT | DELETE
*-------------------------------------
*/


/*
GET
*/
describe('GET /trivia', function(){
	before(function(){
		server = http.createServer(app).listen(3000);
	});
	
	beforeEach(function(done){
		cleanDB(db);
		trivia_a = new TriviaModel({
			title: 'title',
    		user_id: '12345abde',
			hints: ['test-hint1a', 'test-hint2a'],
    		content: 'content',
    		username: 'username'
		});
		trivia_b = new TriviaModel({
			title: 'title-b',
			hints: ['test-hint1b', 'test-hint2b'],
    		user_id: '12345abssde',
    		content: 'content-b',
    		username: 'username-b'
		});
		async.series([
			function(cb){
				request.post('localhost:2000/trivia').send(trivia_a).end(function(err, res){
					cb(null,res);
				});
			},
			function(cb){
				request.post('localhost:2000/trivia').send(trivia_b).end(function(err, res){
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

	it('should return all trivia', function(done){
		request.get('localhost:2000/trivia').end(function(err, res){
			expect(res).to.exist;
			expect(res.status).to.equal(200);
			expect(res.body.length).to.be(2);
			expect(res.body[0].username).to.be('username');
			expect(res.body[1].username).to.be('username-b');
			// expect(res.body[1]).to.have.key('triviaDate');
			done();
		})
	});
});
/*
POST
*/
// describe('POST /trivia', function(){
// 	before(function(){
// 		server = http.createServer(app).listen(3000);
// 	});
	
// 	beforeEach(function(){
// 		cleanDB(db);
// 	});
	
// 	after(function(done){
// 		cleanDB(db);
// 		server.close(done);
// 	});
// 	it('should return the created comment', function(done){
// 		trivia_a = new TriviaModel({
// 			username: 'username',
//     		user_id: '12345abde',
//     		content: 'content',
//     		username: 'username',
//     		modelId: 'modelId'
// 		});
// 		request.post('localhost:2000/trivia').send(trivia_a).end(function(err, res){
// 			expect(res).to.exist;
// 			expect(res.status).to.equal(200);
// 			expect(res.body.user_id).to.be('12345abde');
// 			expect(res.body.username).not.to.be('wrong-username');
// 			expect(res.body.username).to.be('username');
// 			expect(res.body.content).to.be('content');
// 			expect(res.body).to.have.key('commentDate');
// 			expect(res.body).to.have.key('_id');
// 			expect(res.body.modelId).to.be('modelId');
// 			expect(res.body.username).to.be('username');
// 			done();
// 		});
// 		it('should make sure the user_id exists or matches the username provided');
// 		it('should make sure the username exist');
// 		it('should make make sure all fields are passed correctly');
// 	});
// });
// /*
// PUT
// */
// describe('PUT /trivia', function(){
// 	before(function(){
// 		server = http.createServer(app).listen(3000);
// 	});
	
// 	beforeEach(function(){
// 		cleanDB(db);
// 	});
	
// 	after(function(done){
// 		cleanDB(db);
// 		server.close(done);
// 	});

// 	var comment = new TriviaModel({
// 		username: 'username',
// 		user_id: '12345abde',
// 		content: 'content',
// 		username: 'username',
// 		modelId: 'this model id'
// 	});
// 	it('Should modify the comment', function(done){
// 		async.waterfall([
// 			function(cb){
// 				request.post('localhost:2000/trivia').send(comment).end(function(err, res){
// 					cb(null, res.body);
// 				});
// 			},
// 			function(model, cb){
// 				model.content = 'edited-content';
// 				model.username = 'edited-username';
// 				model.username = 'username-edited';
// 				request.put('localhost:2000/trivia/'+ model._id).send(model).end(function(res){
// 					cb(null, res);
// 				});	
// 			}
// 		], function(err, res){
// 			console.log('body', res.body);
// 			expect(res).to.exist;
// 			expect(res.status).to.equal(200);
// 			expect(res.body).to.not.be.empty();
// 			expect(res.body.username).not.to.be('wrong-username');
// 			expect(res.body.username).to.be('edited-username');
// 			expect(res.body.content).to.be('edited-content');
// 			expect(res.body.username).to.be('username-edited');
// 			expect(res.body.modelId).to.be('this model id');
// 			expect(res.body).to.have.key('commentDate');
// 			expect(res.body).to.have.key('_id');
// 			done();
// 		});
// 	});
// });
// /*
// DELETE
// */
// describe('DELETE /trivia', function(){
// 	before(function(){
// 		server = http.createServer(app).listen(3000);
// 	});
	
// 	beforeEach(function(){
// 		cleanDB(db);
// 	});
	
// 	after(function(done){
// 		cleanDB(db);
// 		server.close(done);
// 	});

// 	var comment = new TriviaModel({
// 		username: 'username',
// 		user_id: '12345abde',
// 		content: 'content',
// 		username: 'username',
// 		modelId: 'this model id'
// 	});
	
// 	it('should delete the comment', function(){
// 		async.waterfall([
// 			function(cb) {
// 				request.post('localhost:2000/trivia').send(comment).end(function(err, res){
// 					TriviaModel.count({}, function(err, cnt){
// 						expect(cnt).to.be(1);
// 						cb(null, res.body);
// 					});

// 				});
// 			},
// 			function(model, cb) {
// 				request.del('localhost:2000/trivia/'+ model._id).end(function(res) {
// 					TriviaModel.count({}, function(err, cnt){
// 						expect(cnt).to.be(0);
// 						cb(null, res);
// 					});
// 				});	
// 			}
// 		], function(err, res){
// 			if (!err) {
// 				expect(res).to.exist;
// 				expect(res.status).to.equal(200);
// 				expect(res.body).to.not.be.empty();
// 				TriviaModel.count({}, function(err, cnt){
// 					expect(cnt).to.be(0);
// 					done();
// 				});
// 			}
// 			else {
// 				console.log('Uncaught error: ' + err);
// 			}
// 		});	
// 	});
// });
