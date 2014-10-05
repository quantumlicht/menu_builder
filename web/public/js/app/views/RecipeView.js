// IndexView.js

define(["utils",
        "app",
        "models/RecipeModel",
        "text!templates/Recipe.html"],

    function(utils, app, RecipeModel, RecipeTemplate){

        var RecipeView = Backbone.View.extend({

            // The DOM Element associated with this view
            tagName: 'div',
            className: 'recipes',
            template: Handlebars.compile(RecipeTemplate),
            renderForListView: false,
            // View constructor
            initialize: function(options) {
                // $('#' + Backbone.history.fragment.split('/')[0]).addClass('active');

                if (options && options.renderForListView && typeof options.renderForListView === 'boolean' ) {
                    this.renderForListView = options.renderForListView;
                }
                _.bindAll(this);
                // this.listenTo(this.model, 'saved', this.render);
            },

            // View Event Handlers
            events: {
            },


            // Renders the view's template to the UI
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));

                // Maintains chainability
                return this;

            }
        });

        // Returns the View class
        return RecipeView;

    }

);