// IndexModel.js

define(["app", "utils"],

    function(app, utils) {

        // Creates a new Backbone Model class object
        var MetadataModel = Backbone.Model.extend({

            // Model Constructor
            initialize: function() {
                _.bindAll(this);
            },

            // Default values for all of the Model attributes
            defaults: {
            },

            parse: function(response) {
               response.id = response._id;
               return response;
            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {
                var errors = this.errors = {};

                if(!_.isEmpty(errors)) return errors;
            }   
            

        });

        // Returns the Model class
        return MetadataModel;

    }

);
