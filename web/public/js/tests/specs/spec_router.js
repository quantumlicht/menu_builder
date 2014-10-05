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

     
        // Backbone Router Suite: contains all tests related to routers
        describe("Backbone router", function () {
            beforeEach(function(){
                Backbone.history.stop(); //stop the router
                this.index = spyOn(Router.prototype, 'index').and.callThrough(); //spy on our routes, and they won't get called
                this.login = spyOn(Router.prototype, 'login').and.callThrough(); //spy on our routes, and they won't get called
                // this.index = spyOn(Router.prototype, 'index').and.callThrough(); //spy on our routes, and they won't get called
                this.router = new Router();
                Backbone.history.start();
            });


            afterEach(function(){
                this.router.navigate('/tests');
            });                                        

            it('has an index route', function(){
                var router = new Router();
                expect(router.routes['']).toBe('index');
            });


            it(' "" routes to index', function(){
                this.router.navigate('', {trigger:true});
                expect(this.index).toHaveBeenCalled();
            });
            it('"/" routes to index', function(){
                this.router.navigate('/', {trigger:true});
                expect(this.index).toHaveBeenCalled();
            });

            it('"/login" routes to login', function(){
                this.router.navigate('/login', {trigger:true});
                expect(this.login).toHaveBeenCalled();
            });

        });
});