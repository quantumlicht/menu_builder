// Jasmine Unit Testing Suite
// ==========================

define(["app",
        "text!templates/BlogPost.html",
        "views/CommentView",
        "models/CommentModel",
        "models/SessionModel",
        "routers/Router",
        "jasmine-jquery"],

    function(app, template, CommentView, CommentModel, SessionModel, Router) {

        describe("Comment views", function(){

            beforeEach(function() {

                app.router = new Router();
                app.session = new SessionModel();

                 // Check the auth status upon initialization,
                // before rendering anything or matching routes
                // app.session.checkAuth({
                //     complete: function(){
                //         var hasPushstate = !!(window.history && history.pushState);
                //         if(hasPushstate){
                //            // Backbone.history.start({ pushState: true, root: '/' } );
                //             // Backbone.history.start(); 
                //         } 
                //         // else Backbone.history.start();   
                //     }
                // });

                $('body').append('<div id="commentContainer"></div>');

                this.model = new CommentModel({
                    username: 'test-user',
                    user_id: 'user_id',
                    content: 'test-content',
                    commentDate: new Date('2014/06/7 19:00:00'),
                    modelUrl: 'trivia/12345',
                    modelId: 'model-id'
                });

                this.commentView = new CommentView({ model: this.model });


            });


            afterEach(function() {
                this.commentView.remove();
                $('#commentContainer').remove();
                Backbone.history.stop();
            });

            it('should be tied to a DOM element when created', function(){
                expect(this.commentView.el.tagName.toLowerCase()).toBe('div');
            });

            describe('Comment views rendering', function(){
                afterEach(function() {
                    Backbone.history.stop();
                });
                
                it('returns the view object', function(){
                    expect(this.commentView.render()).toEqual(this.commentView);
                });

                // it('produces the correct html', function(){
                //     this.commentView.render();

                //     expect(this.commentView.el.innerHTML).toContain('<h6><a href="#/users/totob">totob</a> - 3 minutes ago</h6>');
                // });
            });
        });
});