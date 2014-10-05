// IndexCollection.js

define(["app", "models/RecipeModel"],
	function(app, RecipeModel) {

		// Creates a new Backbone Collection class object
		var RecipeCollection = Backbone.Collection.extend({
            
           	type: "",
			model: RecipeModel,
			url: function(){
				return '/recipes/' + this.type + '?page=' + this.page; 

			},
			initialize: function(options){
				this.page = 0;
				this.lastPage = false;
			},

			fetch: function(options) {
				console.log('RecipeCollection', 'fetching for', this.type);
				if (!this.lastPage) {
					this.page += 1;
				}
				console.log('RecipeCollection', 'fetch', this.type, options);
				return Backbone.Collection.prototype.fetch.call(this, options);
			},

			parse: function(res) {
				this.lastPage = res.lastPage;
				console.log('RecipeCollection', this.type, res.recipes);
				return res.recipes;
			},

			canFetchMoreData: function(){
				return !this.lastPage;
			}


		});
		// Returns the Model class
		return RecipeCollection;

	}
);