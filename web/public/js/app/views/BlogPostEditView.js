// IndexView.js

define(["app", "collections/ChoreCollection", "text!templates/BlogPostEdit.html"],

    function(app, ChoreCollection, template){

        var BlogPostEditView = Backbone.View.extend({


            template: Handlebars.compile(template),
            // View constructor
            initialize: function(options) {
                _.bindAll(this);
                this.collection = new ChoreCollection();
            },

            // View Event Handlers
            events: {
                "click #blogpost-edit-cancel": "removeEditionPane",
                "click #blogpost-edit-save": "saveChanges"
            },

            removeEditionPane: function(){
                console.log('BlogPostEditView', 'removeEditionPane');
                this.model.trigger('blogpost-edit');
            },

            // Renders the view's template to the UI
            render: function() {
                this.$el.html(this.template({content:this.model.get('content')}));

                // Maintains chainability
                return this;

            },

            saveChanges: function(){
                console.log('BlogPostEditView', 'saveChanges');
                this.model.set('content', $('.blogpost-edit').val());
                this.collection.create(this.model);
                this.model.trigger('blogpost-edit');
            }

        });

        // Returns the View class
        return BlogPostEditView;

    }

);
