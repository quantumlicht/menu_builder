// IndexView.js

define(["app", "utils", "text!templates/Login.html", "text!templates/LoggedIn.html"],

    function(app, utils, template, LoggedInTemplate){

        var LoginView = Backbone.View.extend({

            // The DOM Element associated with this view
            // el: ".magic",
            template: Handlebars.compile(template), 
            // View constructor
            initialize: function() {

                // Calls the view's render method
                _.bindAll(this);
                app.session.on("change:logged_in", this.render);
                console.log('LoginView', 'initialize');
                // this.render();
                // this.collection = new userCollection();
                // this.collection.fetch();

            },

            // View Event Handlers
            events: {
                "click #login": "onLoginAttempt",
                "click #password": "onPasswordKeyup"
            },

            onPasswordKeyup: function(evt) {
                var k = evt.keyCode || evt.which;

                if (k==13 && $('#password').val() === '') {
                    evt.preventDefault();
                }
                else if ( k == 13){
                    evt.preventDefault();
                    this.onLoginAttempt();
                    return false;
                }
            },

            onLoginAttempt: function(evt) {
                if (evt) evt.preventDefault();

                // If form is valid
                app.session.login({
                    username: this.$('#username').val(),
                    password: this.$('#password').val()
                }, {
                    success: function(mod, res) {
                        console.log(mod, res);
                    },
                    error: function(mod, res) {

                        console.log("ERROR", mod, res);
                    }
                });
                //Error message if validation not passed
            },

            // Renders the view's template to the UI
            render: function() {
                console.log('LoginView', 'render', app.session);
                // if(app.session.get('logged_in')) this.template = Handlebars.compile(LoggedInTemplate);
                // else this.template = Handlebars.compile(template);

                // Setting the view's template property using the Underscore template method

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template({
                    user: app.session.user.toJSON()
                }));

                // Maintains chainability
                return this;

            },


            // login: function(e) {
            //     e.preventDefault();
            //     this.collection.fetch({reset: true});
            //     this.collection.each(function(el, i){
            //         if ( el.attributes.password === $('#password').val() && 
            //         el.attributes.username === $('#username').val() ) {
            //             $("#loginForm").submit();
            //         } 
            //     });
            //     this.renderError({},'Wrong Password or Username');
            //     formData = {};

            //     if ($("#password").val() ==='' || $("#username").val() === '') {
            //         this.renderError({},'Password or Username cannot be empty');
            //     }
            // },
            
            renderError: function(error, errMsg) {
                $('.error-field').html(errMsg);
            }

        });

        // Returns the View class
        return LoginView;

    }

);
