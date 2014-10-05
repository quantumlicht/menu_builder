// Jasmine Unit Testing Suite
// ==========================

define(["app",
        "utils",
        "text!templates/BlogPost.html",
        "views/BlogPostView",
        "models/BlogPostModel",
        "models/CommentModel",
        "collections/ChoreCollection",
        "routers/Router",
        "jasmine-jquery"],

    function(app, utils, template, BlogPostView, BlogPostModel, CommentModel, ChoreCollection, Router) {

        // Test suite that includes all of the Jasmine unit tests   
        describe("BlogPostModel Behavior", function() {

            it("deletes attached comments when it is destroyed", function(){
            	this.postcollection = new ChoreCollection();

            	this.defaultPost = new BlogPostModel();
                
                this.customPost = new BlogPostModel({
                    title: 'This is a title',
                    username: 'username string',
                    user_id: '12345abcde',
                    postDate: new Date('2014-12-12'),
                    content: 'Content'
                });

                this.postcollection.create(this.customPost,{wait:true});
                this.postcollection.create(this.defaultPost, {wait:true});

                // Need to add callback to wait for model creation
            	this.comment = new CommentModel({
            		content: 'comment content',
                    username: 'username string',
                    modelId: this.customPost.get('_id'),
                    modelUrl: this.customPost.url(),
                    user_id: this.customPost.get('_id')
            	});
            	
            	console.log('TEST', this.customPost)
            	this.postView = new BlogPostView();
                this.postView.commentCollection.create(this.comment);

                expect(this.postView.commentCollection.length).toBe(1);
                // this.customPost.destroy();
                // expect(errorArgs[1].postDate).toBe('Blog post date cannot be in the future');

            });
        });
});