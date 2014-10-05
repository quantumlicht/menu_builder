// IndexView.js

define(["app", "models/UserModel", "text!templates/User.html"],

    function(app, Model, template){

        var UserView = Backbone.View.extend({

            template: Handlebars.compile(template),
            // View constructor
            initialize: function() {

                // Calls the view's render method
                _.bindAll(this);
                var self = this;
                this.model.fetch({
                    success: function(model) {
                        self.render();
                    }
                },
                {reset:true});

                // this.listenTo(this.model, 'change', this.render);
            
            },

            // View Event Handlers
            events: {

            },

            render: function() {

                // Setting the view's template property using the Underscore template method

                // Dynamically updates the UI with the view's template
                // console.log('UserView', 'render', 'model data', Model.toJSON());
                console.log('UserView','render','model.toJSON   ', this.model.toJSON());
                this.$el.html(this.template(this.model.toJSON()));

                // Maintains chainability
                return this;

            }

        });

        return UserView;

    }

);