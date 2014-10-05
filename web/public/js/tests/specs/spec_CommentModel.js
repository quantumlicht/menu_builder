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

        describe("CommentModel", function() {
            beforeEach(function(){
                this.defaultComment = new CommentModel();
                this.customComment = new CommentModel({
                    username: 'Username',
                    user_id: '123465789',
                    content: 'Content',
                    commentDate: new Date('2014-12-12'),
                    modelId: '134abc',
                    modelUrl: 'model-url'
                });

                app.session.user.set('username', 'test-user');

                this.errorCallback = jasmine.createSpy('-invalid callback-');

                this.defaultComment.on('invalid', this.errorCallback);
            });

            it("can be altered only if the author is logged in", function(){

                //session is set to test-user in beforeEach
                comment = new CommentModel({
                    username: 'test-user'
                });

                othercomment = new CommentModel();

                expect(comment.get('alterable')).toBe(true);
                expect(this.defaultComment.get('alterable')).toBe(false);
            });

            it("can be created with default values", function(){
                expect(this.defaultComment.get('username')).toBe('Unknown');
                expect(this.defaultComment.get('modelUrl')).toBe('');
                expect(this.defaultComment.get('user_id')).toBe('');
                expect(this.defaultComment.get('modelId')).toBe('');
                expect(this.defaultComment.get('commentDate')).toEqual(jasmine.any(Date));
                expect(this.defaultComment.get('commentDate')).toBeLessThan(new Date());
            });

            it("can store various values", function(){
                expect(this.customComment.get('username')).toBe('Username');
                expect(this.customComment.get('user_id')).toBe('123465789');
                expect(this.customComment.get('modelId')).toBe('134abc');
                expect(this.customComment.get('modelUrl')).toBe('model-url');
                expect(this.customComment.get('commentDate')).toEqual(jasmine.any(Date)); 
                expect(this.customComment.get('commentDate')).toEqual(new Date('2014-12-12'));
                expect(this.customComment.get('content')).toBe('Content');
            });

             it("has username validation logic and can trigger invalid event on failed validation.", function(){

                var comment = this.defaultComment;
                var othercomment = this.customComment;
                comment.set({username:''}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(comment);
                expect(errorArgs[1].username).toBe('Username cannot be empty');

                comment.set({username:undefined}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(comment);
                console.log('errorArgs', errorArgs);
                expect(errorArgs[1].username).toBe('Username cannot be empty');

                comment.unset('username');
                comment.isValid();
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(comment);
                expect(errorArgs[1].username).toBe('Username needs to be set');
            });


            it("has user_id validation logic and can trigger invalid event on failed validation.", function(){

                var comment = this.defaultComment;
                comment.set({user_id:''}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(comment);
                expect(errorArgs[1].user_id).toBe('user_id cannot be empty');

            });
            it("has content validation logic and can trigger invalid event on failed validation.", function(){
                var comment = this.defaultComment;
                comment.set({content:''}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(comment);
                expect(errorArgs[1].content).toBe('Content cannot be empty');

            });
            it("has modelUrl validation logic and can trigger invalid event on failed validation.", function(){
                var comment = this.defaultComment;
                comment.set({modelUrl:''}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(comment);
                expect(errorArgs[1].modelUrl).toBe('modelUrl cannot be empty');

            });
            it("has modelID validation logic and can trigger invalid event on failed validation.", function(){
                var comment = this.defaultComment;
                comment.set({modelId:''}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(comment);
                expect(errorArgs[1].modelId).toBe('modelId cannot be empty');

            });
            it("has commentDate validation logic and can trigger invalid event on failed validation.", function(){
                var comment = this.defaultComment;
                var now = new Date();
                var futureDate = now.setDate(now.getDate() + 14);

                comment.set({commentDate: futureDate}, {validate:true});
                errorArgs = this.errorCallback.calls.mostRecent().args;
                expect(this.errorCallback).toHaveBeenCalled();
                expect(errorArgs).toBeDefined();
                expect(errorArgs[0]).toBe(comment);
                expect(errorArgs[1].commentDate).toBe('Comment date cannot be in the future');

            });
        });
});