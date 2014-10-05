// IndexCollection.js

define(["app", "models/MetadataModel"],
	function(app, MetadataModel) {

		// Creates a new Backbone Collection class object
		var MetadataCollection = Backbone.Collection.extend({
            
           
			model: MetadataModel,
			url: function(){
				return '/metadata/' + this.type; 

			},
			initialize: function(options){
				if (options && options.type) {
					this.type = options.type;
				}
			}
		});
		// Returns the Model class
		return MetadataCollection;

	}
);