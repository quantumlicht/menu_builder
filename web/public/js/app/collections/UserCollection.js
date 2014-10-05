// IndexCollection.js

define(["app","models/UserModel"],
	function(app, Model) {

		// Creates a new Backbone Collection class object
		var UserCollection = Backbone.Collection.extend({

			// Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
			model: Model,
			url: app.root + '/users/'

		});

		// Returns the Model class
		return UserCollection;

	}

);