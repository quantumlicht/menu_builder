// IndexModel.js

define(["app", "utils"],

    function(app, utils) {

        // Creates a new Backbone Model class object
        var UserModel = Backbone.Model.extend({

            // Model Constructor
            initialize: function() {
                _.bindAll(this);
            },

            url : function() {                  
                console.log('UserModel', 'url', 'user_id', this.get('user_id'));
                return '/users/' + this.get('user_id');
            },  


            // Default values for all of the Model attributes
            defaults: {
                id: 0,
                username: '',
                name: '',
                picture: '',
                gender: 'male',
                user_id: ''
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
        return UserModel;

    }

);
