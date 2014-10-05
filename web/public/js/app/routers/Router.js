// Router.js

define([
    "app",
    "models/UserModel",
    "views/HeaderView",
    "views/LoginView",
    "views/RegisterView",
    "views/IndexView",
    "views/RecipeListView",
    "views/RecipeView",
    "views/UserView",
    "collections/RecipeCollection",
    "collections/UserCollection"

    ],

    function(app,
             UserModel,
             HeaderView,
             LoginView,
             RegisterView,
             IndexView,
             RecipeListView,
             RecipeView,
             UserView,
             RecipeCollection,
             UserCollection) {

        Backbone.View.prototype.close = function () {
            this.$el.empty();
            this.unbind();
        };

        var Router = Backbone.Router.extend({

            initialize: function() {

                _.bindAll(this);
                // Tells Backbone to start watching for hashchange events
                // Backbone.history.start();

            },

            // All of your Backbone Routes (add more)
            routes: {
                // When there is no hash on the url, the home method is called
                "": "index",
                "register": "register",
                "blogposts/:id": "blog",
                "users/:user_id": "userprofile",
                "admin": "admin",
                "login": "login"    
            },  

            index: function() {
                console.log('Router', 'index');
                // Instantiates a new view which will render the header text to the page
                // var hasPushState = !!(window.history && history.pushState);
                // if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
                // else {
                    // console.log('Router','index','has push state');
                this.show( new IndexView({}) );
                    //if(app.session.get('logged_in')) this.show( new LoginPageView({}) );
                    //else this.show( new LoggedInPageView({}) );
                // }        
            },

            blog: function(id){
                console.log('Router','blog');
                var self = this;
                var collection = new RecipeCollection();
                collection.bind('reset', function () { 
                    console.log('collection', collection);
                    var model = collection.findWhere({id: id});
                    console.log('Router', 'blog', 'model', model);
                    var view = new ChoreView({model: model});
                    self.show(view);
                });
                collection.fetch({reset:true});
                // this.show(new ChoreListView());
            },

            admin: function(){
                console.log('Router','admin');
                this.show(new ChoreAdminView());
                // also need to add management portal for trivias
            },

            login: function() {
                console.log('Router', 'login');
                this.show(new LoginView());
            },

            register: function() {
                console.log('Router', 'register');
                // var hasPushState = !!(window.history && history.pushState);
                // if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
                // else {
                this.show( new RegisterView({}) );
                // }
            },


            userprofile: function(user_id) {
                var self = this;
                var collection = new UserCollection();

                model = new UserModel({user_id: user_id});
                this.show(new UserView({
                    model:model
                }));
                // collection.bind('reset', function () { 
                //     var model = collection.findWhere({user_id: user_id});
                //     var view = new UserView({model: model});
                //     self.show(view);
                // });
                // collection.fetch({reset:true});
            },


            show: function(view, options) {
                if (!this.headerView) {
                    this.headerView = new HeaderView({});
                    this.headerView.setElement($("header")).render();
                }

                if (this.currentView) this.currentView.close();
                this.currentView = view;

                // Need to be authenticated before rendering view.
                // For cases like a user's settings page where we need to double check against the server.
                if (typeof options !== 'undefined' && options.requiresAuth){        
                    var self = this;
                    app.session.checkAuth({
                        success: function(res){
                            // If auth successful, render inside the page wrapper
                            $('#content').html( self.currentView.render().$el);
                        }, error: function(res){
                            self.navigate("/", { trigger: true, replace: true });
                        }
                    });

                } else {
                    // Render inside the page wrapper
                    $('#content').html(this.currentView.render().$el);
                    //this.currentView.delegateEvents(this.currentView.events);        // Re-delegate events (unbound when closed)
                }
            }
        });

        // Returns the DesktopRouter class
        return Router;

    }

);