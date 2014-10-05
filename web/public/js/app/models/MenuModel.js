define([
	"app",
	"utils",
	"models/MenuBuilderModel",
	"models/RecipeAggregator",
	"collections/MetadataCollection",
	"collections/RecipeCollection"
],
	function(app,utils,
			MenuBuilderModel,
			RecipeAggregator,
			MetadataCollection,
			RecipeCollection) {

		var MenuModel = Backbone.Model.extend({

			recipeCollections: {},

			initialize: function() {
				this.ingredient_filters = {include: [], exclude: [] };
				this.max_cook_time = 9999999;

				this.MENU_SEMAPHORE = 999999;
				this.courses_to_process = 0;

				this.courseCollection = new MetadataCollection({type:'course'});
				Backbone.trigger('menu:busy');
				this.courseCollection.fetch({reset:true});
				this.menu = {};
				this.preferredCourses = [];

				this.listenTo(this.courseCollection, 'reset', this.initRecipeCollections);
				this.listenTo(this.courseCollection,'reset', function(){Backbone.trigger('menu:ready');});


				//Processing pipeline
				// Backbone.on('recipe:fetching:finished', this.filter_by_ingredients, this);
				// Backbone.on('filter:by_ingredients:finished', this.filter_by_cooking_time, this);

				// By nutrients should be on a per meal basis, the balancing of the intake should be left out to the menubuilder.
				// I want those 2 stages to be decoupled. Once we call buildMenu, there is no going back.
				// Backbone.on('filter:by_cooking_time:finished', this.filter_by_nutrients, this);
			},

			buildMenu: function() {
				var self = this;
				courses = _.filter(this.courseCollection.models, function(elem){
					return _.indexOf(self.preferredCourses, elem.get('description')) >= 0;
				});
				this.MENU_SEMAPHORE = courses.length;
				console.log('Semaphore', this.MENU_SEMAPHORE);
				this.courses_to_process = courses.length; 

				this.courseCollection.set(courses);
				console.log('buildMenu', 'courseCollection', this.courseCollection);
				this.initRecipeCollections();
                Backbone.trigger('loading:started');
				_.each(this.courseCollection.models, function(course){
					console.log("course description", course.get('description'));
					var aggregator = new RecipeAggregator({
						type: course.get('description'),
						ingredient_filters: self.ingredient_filters,
						max_cook_time: self.max_cook_time
					});
					self.listenToOnce(aggregator, 'aggregator:finished:' + course.get('description').replace(/\s/g,''), self.exitPipeline);	
					aggregator.collect();
				});
			},

            initRecipeCollections: function() {

				this.recipeCollections = {};
                var val;
                for (var i=0; i < this.courseCollection.models.length; i++) {
                    val = this.courseCollection.models[i].get('description');
                    col = new RecipeCollection([]);
                    col.type = val;
                    this.recipeCollections[val] = col;
                }
            },

            exitPipeline: function(event_data){
            	console.log('EXIT PIPELINE for', event_data);
            	this.recipeCollections[event_data.recipe_type] = event_data.collection;
				
				console.log('collection at end of pipeline', this.recipeCollections);
				this.MENU_SEMAPHORE--;
				progress = 100 * (this.courses_to_process - this.MENU_SEMAPHORE) /  this.courses_to_process;
				Backbone.trigger('menu:progress', {type: event_data.recipe_type, progress: progress});
				
				if (this.MENU_SEMAPHORE <= 0) {
					console.log('SEMAPHORE RELEASED');
					Backbone.trigger('loading:finished');
					this.menuBuilder = new MenuBuilderModel({
						recipeCollections: this.recipeCollections
					});
					console.log('menuBuilder', this.menuBuilder);
					this.menuBuilder.buildMenu();
				}
            }
		});

		return MenuModel;
	}
);