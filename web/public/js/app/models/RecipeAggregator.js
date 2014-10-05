define([
	"app",
	"utils",
	"models/MenuBuilderModel",
	"collections/MetadataCollection",
	"collections/RecipeCollection"
],
function(app,utils,
		MenuBuilderModel,
		MetadataCollection,
		RecipeCollection) {

	var RecipeAggregator = Backbone.Model.extend({


		// type: '',

		initialize: function() {
			// global_event determines if the event is global or is trigger for each course
			this.pipeline_events = {
				FETCH: {
					finished: {
						global_event: false,
						evt:'recipe:fetching:finished:',
						next: 'filter_by_ingredients'
					}
				},
				INGREDIENTS: {
					finished: {
						global_event: false,
						evt:'filter:filter_by_ingredients:finished:',
						next: 'filter_by_cooking_time'
					}
				},
				COOKTIME: {
					finished: {
						global_event: false,
						evt:'filter:by_cooking_time:finished:',
						next: 'filter_by_nutrients'
					}
				},
				NUTRIENTS: {
					finished: {
						global_event:false,
						evt:'aggregator:finished:',
						next: ''
					}
				}
			},
		 	this.initializeEventPipeline();
			this.recipeCollection = new RecipeCollection([]);
			this.recipeCollection.type = this.get('type');
			// this.enablePipelineEvent(this.pipeline_events.FETCH.finished);
			// this.enablePipelineEvent(this.pipeline_events.INGREDIENTS.finished);
			// this.enablePipelineEvent(this.pipeline_events.COOKTIME.finished);
			// // this.enablePipelineEvent(this.pipeline_events.NUTRIENTS.finished);
		},

		initializeEventPipeline: function(){
			var self = this;
			var event_obj = {};
			_.each(this.pipeline_events, function(stage, stage_key){
				_.each(stage, function(event, event_type) {
					if (!stage[event_type].global_event) {
						event_obj = {
							global_event: event.global_event,
							evt: event.evt + self.get('type').replace(/\s/g,''), // TEST
							next: event.next
						};
					}
					else {
						event_obj = {
							global_event: event.global_event,
							evt: event.evt,
							next: event.next
						};
					}

					self.pipeline_events[stage_key][event_type] = event_obj;
					self.enablePipelineEvent(self.pipeline_events[stage_key][event_type]);
				});
			});

			console.log('pipeline_events', 'type', this.get('type'), this.pipeline_events);
		},

		collect: function(){
			this.fetch_recipes();
		},

		enablePipelineEvent: function(event) {
			if (event.next !=='') {
				if (event.global_event) {
					this.once(event.evt, this[event.next], this); //test should be on
				}
				else {
					this.once(event.evt, this[event.next], this);
				}
			}

		},

		firePipelineEvent: function(event, args){
			console.log('firePipelineEvent', 'event',event,'args', args);
			if (args === undefined) {
				args = {};
			}
			this.trigger(event.evt, args);

		},

		disablePipelineEvent: function(event) {
			this.off(event.evt);	
		},



	  	//==================================================================================================================
        // RECIPE AGGREGATION SERVICE
        //==================================================================================================================
        fetch_recipes: function() {
            var self = this;
			console.log('fetch_recipes for', this.get('type'), this.recipeCollection.length, this.recipeCollection.canFetchMoreData());
            if (this.recipeCollection.length < app.MIN_RESULTS && this.recipeCollection.canFetchMoreData()) {
				// console.log('Fetching more results from server for', self.get('type'));
                this.recipeCollection.fetch({
					remove:false,
					success: function(col, res, options){
						// console.log('retrieved collection for ', self.get('type'), col, res, options);
						self.recipeCollection = col;	
						self.fetch_recipes();
					},
					error: function(err){
						console.log('error while fetching', err);
					}
				});
				return;
            }
            else if (this.recipeCollection.length < app.MIN_RESULTS && !this.recipeCollection.canFetchMoreData()){
            	console.log('fetch_recipes for', this.get('type'), 'not enough recipes and cannot fetch more');
                utils.showAlert(
                    ':(',
                    'Your search returned only ' +
                    this.get('type') + ' ' +
                    this.recipeCollection.length +	
                    ' recipes... Maybe try something else?',
                    'alert-warning'
                );
                // this.enablePipelineEvent(this.pipeline_events.FETCH.finished);
				this.firePipelineEvent(this.pipeline_events.FETCH.finished);
            }
            else {
            	// console.log('finished fetching recipes');
				this.firePipelineEvent(this.pipeline_events.FETCH.finished);
			}

            return;
        },

        

        //==================================================================================================================
        // FILTER METHODS
        //==================================================================================================================
        filter_by_ingredients: function() {
        	console.log('filter_by_ingredients for', this.get('type'));
			var recipes = this.recipeCollection.models;

			var allowed_ingredients = this.get('ingredient_filters').include;
			var excluded_ingredients = this.get('ingredient_filters').exclude;

			var included_matching_recipes = [];
			var excluded_matching_recipes = recipes;
            
            for (var i=0; i<recipes.length;i++) {
                if (excluded_ingredients && excluded_ingredients.length > 0) {
                    for (var j=0; j<excluded_ingredients.length;j++) {
                        if ( $.inArray(excluded_ingredients[j], recipes[i].get('ingredients')) > -1) { 
                            excluded_matching_recipes.splice(i,1); //removing this recipe from list
                        }
                    }
                }
                if (allowed_ingredients && allowed_ingredients.length > 0) {
                    for (var k=0; k<allowed_ingredients.length;k++) {
                        if ( $.inArray(allowed_ingredients[k], recipes[i].get('ingredients')) > -1) {
                            included_matching_recipes.push(recipes[i]); break;
                        }   
                    }
                    
                }
            }

            var filtered_recipes = _.intersection(included_matching_recipes, excluded_matching_recipes);
            this.recipeCollection.set(filtered_recipes);

            // console.log('filter_by_ingredients', 'filtered_recipes.length', filtered_recipes.length);
            if ( filtered_recipes.length < app.MIN_RESULTS && this.recipeCollection.canFetchMoreData() ){
            	console.log('filter_by_ingredients', 'not enough recipes');
            	this.enablePipelineEvent(this.pipeline_events.FETCH.finished);
				this.fetch_recipes();
            }
            else{
            	console.log('filter_by_ingredients for', this.get('type'), 'not enough recipes or cannot fetch more');
            	this.enablePipelineEvent(this.pipeline_events.INGREDIENTS.finished);
				this.firePipelineEvent(this.pipeline_events.INGREDIENTS.finished);
            }
        },

        filter_by_cooking_time: function() {
        	console.log('filter_by_cooking_time for', this.get('type'));
			var self = this;
			var recipes = this.recipeCollection;
			var filtered_recipes = recipes.filter(function(elem){
				time = elem.get('totalTimeInSeconds');
				return time < self.get('max_cook_time') || time === null;
			});
			
			this.recipeCollection.set(filtered_recipes);

			if (filtered_recipes.length < app.MIN_RESULTS && this.recipeCollection.canFetchMoreData()) {
            	console.log('filter_by_cooking_time', 'not enough recipes');
				this.enablePipelineEvent(this.pipeline_events.FETCH.finished);
				this.fetch_recipes();
			}
			else {
            	// console.log('filter_by_cooking_time', 'not enough recipes or cannot fetch more');
            	this.enablePipelineEvent(this.pipeline_events.COOKTIME.finished);
				this.firePipelineEvent(this.pipeline_events.COOKTIME.finished);
			}
        },

        filter_by_nutrients: function() {
        	console.log('filter_by_nutrients for', this.get('type'));
			if (this.recipeCollection.length < app.MIN_RESULTS && this.recipeCollection.canFetchMoreData()) {
        		console.log('filter_by_nutrients', 'not enough recipes');
				this.enablePipelineEvent(this.pipeline_events.FETCH.finished);
				this.fetch_recipes();
			}
			else {
				console.log('filter by nutrients', 'done');
				this.firePipelineEvent(this.pipeline_events.NUTRIENTS.finished, {recipe_type: this.get('type'), collection: this.recipeCollection} );
			}
        }



	});

	return RecipeAggregator;
});