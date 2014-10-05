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

    function(app, utils, template, View, BlogPostModel, CommentModel, Collection, Router) {

        // Test suite that includes all of the Jasmine unit tests   
        describe("BlogPostModel", function() {

            
            beforeEach(function(){
                spyOn(BlogPostModel.prototype, "validate").and.callThrough();
                this.defaultPost = new BlogPostModel();
                this.customPost = new BlogPostModel({
                    title: 'This is a title',
                    username: 'username string',
                    user_id: '12345abcde',
                    postDate: new Date('2014-12-12'),
                    content: 'Content'
                });

                app.session.user.set('username', 'test-user');

                this.errorCallback = jasmine.createSpy('-invalid callback-');

                this.defaultPost.on('invalid', this.errorCallback);
            });


            it("can be altered only if author is logged in", function(){

                //session is set to test-user in beforeEach
                post = new BlogPostModel({
                    username: 'test-user'
                });

                expect(post.get('alterable')).toBe(true);
                expect(this.defaultPost.get('alterable')).toBe(false);
            });

            it("should be in a valid state", function() {
                expect(this.defaultPost.isValid()).toBe(true);
            });

            it("should call the validate method when setting a property", function() {
                this.defaultPost.set({ title: "test" }, { validate: true });
                expect(BlogPostModel.prototype.validate).toHaveBeenCalled();
            });

            it("can be created with default values", function(){
                expect(this.defaultPost.get('username')).toBe('Philippe Guay');
                expect(this.defaultPost.get('title')).toBe('Please enter title');
                expect(this.defaultPost.get('content')).toBe('Please enter content');
                expect(this.defaultPost.get('user_id')).toBe('please set id');
            });

            it("can store various values", function(){
                
                expect(this.customPost.get('title')).toBe('This is a title');
                expect(this.customPost.get('username')).toBe('username string');
                expect(this.customPost.get('user_id')).toBe('12345abcde');
                expect(this.customPost.get('postDate')).toEqual(jasmine.any(Date)); 
                expect(this.customPost.get('postDate')).toEqual(new Date('2014-12-12'));

                expect(this.customPost.get('content')).toBe('Content');

                expect(this.customPost.get('invalid property')).not.toBeDefined();
            });

            it("has username validation logic, and can trigger invalid event on failed validation.", function(){

                // username
                var post = this.defaultPost;
                post.set({username:''}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(post);
                expect(errorArgs[1].username).toBe('Username cannot be empty');

                post.set({username:undefined}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(post);
                expect(errorArgs[1].username).toBe('Username cannot be empty');

                post.unset('username');
                post.isValid();
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(post);
                expect(errorArgs[1].username).toBe('Username needs to be set');
            });

            it("has title validation logic, and can trigger invalid event on failed validation.", function(){
                var post = this.defaultPost;
                post.set({title:''}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(post);
                expect(errorArgs[1].title).toBe('Title cannot be empty');

            });

            it("has user_id validation logic, and can trigger invalid event on failed validation.", function(){
                var post = this.defaultPost;
                post.set({user_id:''}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(post);
                expect(errorArgs[1].user_id).toBe('user_id cannot be empty');
            });

            it("has content validation logic, and can trigger invalid event on failed validation.", function(){

                var post = this.defaultPost;
                post.set({content:''}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(post);
                expect(errorArgs[1].content).toBe('Content cannot be empty');

            });
            it("has postDate validation logic, and can trigger invalid event on failed validation.", function(){

                var post = this.defaultPost;
                var now = new Date();
                var futureDate = now.setDate(now.getDate() + 14);

                post.set({postDate: futureDate}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(post);
                expect(errorArgs[1].postDate).toBe('Blog post date cannot be in the future');

            });
        });
});