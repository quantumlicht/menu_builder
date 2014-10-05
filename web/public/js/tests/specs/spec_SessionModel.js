// Jasmine Unit Testing Suite
// ==========================

define(["app",
        "utils",
        "text!templates/BlogPost.html",
        "views/BlogPostView",
        "models/SessionModel",
        "collections/ChoreCollection",
        "routers/Router",
        "jasmine-jquery"],

    function(app, utils, template, View, SessionModel, Collection, Router) {

        // Test suite that includes all of the Jasmine unit tests   
        describe("SessionModel", function() {

            
            beforeEach(function(){
                spyOn(SessionModel.prototype, "validate").and.callThrough();
                this.defaultSession = new SessionModel();
                this.customPost = new SessionModel({
                    title: 'This is a title',
                    username: 'username string',
                    user_id: '12345abcde',
                    postDate: new Date('2014-12-12'),
                    content: 'Content'
                });

                // app.session.user.set('username', 'test-user');

                this.errorCallback = jasmine.createSpy('-invalid callback-');

                this.defaultSession.on('invalid', this.errorCallback);
            });

            it("should be in a valid state", function() {
                expect(this.defaultSession.isValid()).toBe(true);
            });

            it("should call the validate method when setting a property", function() {
                this.defaultSession.set({ test: "test" }, { validate: true });
                expect(SessionModel.prototype.validate).toHaveBeenCalled();
            });


            it("can be created with default values", function(){
                expect(this.defaultSession.get('user_id')).toBe('');
                expect(this.defaultSession.get('logged_in')).toBe(false);
                expect(this.defaultSession.user).toBeDefined();
            });

            it("can store various values", function(){
                
                expect(this.defaultSession.url()).toBe('/api/auth');
                expect(this.customPost.get('username')).toBe('username string');
                expect(this.customPost.get('user_id')).toBe('12345abcde');
                expect(this.customPost.get('postDate')).toEqual(jasmine.any(Date)); 
                expect(this.customPost.get('postDate')).toEqual(new Date('2014-12-12'));

                expect(this.customPost.get('content')).toBe('Content');

                expect(this.customPost.get('invalid property')).not.toBeDefined();
            });

            // it("has username validation logic, and can trigger invalid event on failed validation.", function(){

            //     // username
            //     var post = this.defaultSession;
            //     post.set({username:''}, {validate:true});
            //     errorArgs = this.errorCallback.calls.mostRecent().args;
            //     expect(this.errorCallback).toHaveBeenCalled();
            //     expect(errorArgs).toBeDefined();
            //     expect(errorArgs[0]).toBe(post);
            //     expect(errorArgs[1].username).toBe('Username cannot be empty');

            //     post.set({username:undefined}, {validate:true});
            //     errorArgs = this.errorCallback.calls.mostRecent().args;
            //     expect(this.errorCallback).toHaveBeenCalled();
            //     expect(errorArgs).toBeDefined();
            //     expect(errorArgs[0]).toBe(post);
            //     expect(errorArgs[1].username).toBe('Username cannot be empty');

            //     post.unset('username');
            //     post.isValid();
            //     errorArgs = this.errorCallback.calls.mostRecent().args;
            //     expect(this.errorCallback).toHaveBeenCalled();
            //     expect(errorArgs).toBeDefined();
            //     expect(errorArgs[0]).toBe(post);
            //     expect(errorArgs[1].username).toBe('Username needs to be set');
            // });

            // it("has title validation logic, and can trigger invalid event on failed validation.", function(){
            //     var post = this.defaultSession;
            //     post.set({title:''}, {validate:true});
            //     errorArgs = this.errorCallback.calls.mostRecent().args;
            //     expect(this.errorCallback).toHaveBeenCalled();
            //     expect(errorArgs).toBeDefined();
            //     expect(errorArgs[0]).toBe(post);
            //     expect(errorArgs[1].title).toBe('Title cannot be empty');

            // });

            // it("has user_id validation logic, and can trigger invalid event on failed validation.", function(){
            //     var post = this.defaultSession;
            //     post.set({user_id:''}, {validate:true});
            //     errorArgs = this.errorCallback.calls.mostRecent().args;
            //     expect(this.errorCallback).toHaveBeenCalled();
            //     expect(errorArgs).toBeDefined();
            //     expect(errorArgs[0]).toBe(post);
            //     expect(errorArgs[1].user_id).toBe('user_id cannot be empty');
            // });

            // it("has content validation logic, and can trigger invalid event on failed validation.", function(){

            //     var post = this.defaultSession;
            //     post.set({content:''}, {validate:true});
            //     errorArgs = this.errorCallback.calls.mostRecent().args;
            //     expect(this.errorCallback).toHaveBeenCalled();
            //     expect(errorArgs).toBeDefined();
            //     expect(errorArgs[0]).toBe(post);
            //     expect(errorArgs[1].content).toBe('Content cannot be empty');

            // });
            // it("has postDate validation logic, and can trigger invalid event on failed validation.", function(){

            //     var post = this.defaultSession;
            //     var now = new Date();
            //     var futureDate = now.setDate(now.getDate() + 14);

            //     post.set({postDate: futureDate}, {validate:true});
            //     errorArgs = this.errorCallback.calls.mostRecent().args;
            //     expect(this.errorCallback).toHaveBeenCalled();
            //     expect(errorArgs).toBeDefined();
            //     expect(errorArgs[0]).toBe(post);
            //     expect(errorArgs[1].postDate).toBe('Blog post date cannot be in the future');

            // });
        });
});