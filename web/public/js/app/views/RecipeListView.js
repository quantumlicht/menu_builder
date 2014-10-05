// IndexView.js

define([
    "utils",
    "app",
    "views/RecipeView",
    "models/RecipeModel",
    "collections/RecipeCollection",
    "text!templates/RecipeList.html"
    ],

    function(utils, app, RecipeView, RecipeModel, RecipeCollection, RecipeListTemplate){

        var RecipeListView = Backbone.View.extend({

            template: Handlebars.compile(RecipeListTemplate),
            type: '',
            recipes: [],
            recipeCount: 0,

            // View constructor
            initialize: function(options) {
                // Calls the view's render method
                this.recipeCount = 0;
                this.identifier = options.identifier;
                this.type = options.type;
                this.recipes = options.recipes;
                this.recipeCount = this.recipes.length;
                this.week_period = options.week_period;
                _.bindAll(this);
                // this.collection = new RecipeCollection();
                // this.collection.fetch({reset: true});

                // this.listenTo(this.collection, 'add', this.renderRecipe);
                // // this.listenTo(this.collection, 'reset', this.render);
                // this.listenTo(this.collection, 'sort', this.render);
                // console.log('type', this.type);
                // console.log('recipes', this.recipes);

            },

            // Renders the view's template to the UI
            render: function() {
                this.$el.append(this.template({
                    recipeCount:this.recipeCount,
                    type: this.type,
                    id: this.identifier,
                    week_period: this.week_period
                }));
                if (this.recipes.length) {
                    _.each(this.recipes, function(item) {
                        this.renderRecipe(item);
                    }, this);
                }

                return this;

            },

            renderRecipe: function(recipe) {
                var recipeView = new RecipeView({
                    model: recipe,
                    renderForListView: true
                });
                this.$el.find('.recipesContainer').append(recipeView.render().el);
                
            }

        });

        // Returns the View class
        
        return RecipeListView;

    }

);
