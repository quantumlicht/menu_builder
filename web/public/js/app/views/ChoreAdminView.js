define([
    "app",
    "utils",
    "views/RecipeView",
    "models/RecipeModel",
    "collections/RecipeCollection",
    "text!templates/RecipeList.html"
    ],

    function(app, utils, RecipeView, RecipeModel, RecipeCollection, template){

        var RecipeAdminView = Backbone.View.extend({

            template: Handlebars.compile(template),

            // View constructor
            initialize: function() {
                // Calls the view's render method
                this.collection = new RecipeCollection();
                this.collection.fetch({reset: true});
                this.render();
                this.listenTo(this.collection, 'add', this.render);
                this.listenTo(this.collection, 'reset', this.render);
            },

            // View Event Handlers
            events: {
                'click #add': 'addChore'
            },

            // Renders the view's template to the UI
            render: function() {
                this.$el.html(this.template);
                // Setting the view's template property using the Underscore template method
                this.collection.each(function(item) {
                    this.renderRecipe(item);
                }, this);


                // Maintains chainability
                return this;

            },

            addChore: function(e) {
                console.log('ChoreAdminView','addChore');
                e.preventDefault();
                var formData = {};
                $('#addChore div').children('input, textarea, select').each(function(i, el) {
                if ($(el).val() !== '') {
                    formData[el.id] = $(el).val();
                }
                $(el).val('');
                });
                // formData.user_id = app.session.user.get('user_id');
                // formData.username = app.session.user.get('name');
                console.log('ChoreAdminView','addChore','formData', formData);
                this.collection.create(formData);
            },

            renderRecipe: function(recipe) {
                recipe.set('alterable', true);
                var recipeView = new RecipeView({
                    model: recipe
                });
                this.$el.append(recipeView.render().el);
            }

        });

        // Returns the View class
        
        return ChoreAdminView;

    }

);
