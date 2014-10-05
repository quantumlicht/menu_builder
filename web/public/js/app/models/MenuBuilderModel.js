define([
	"app",
	"utils",
	"models/DailyIntakeModel",
	"collections/RecipeCollection"
],
function(app,
		utils,
		DailyIntakeModel,
		RecipeCollection) {

	var MenuBuilderModel = Backbone.Model.extend({
		recipeCollections: {},
		dailyIntake: {},

		WEEK_WEEKEND_INTAKE_RATIO: 0.8, // This should be interpreted as: Daily intake is 20% more on weekend, but over a week, it balances to as if we had the same daily intake.

		intakeWeightsForMeals: {
			// This sets what fraction of the daily intake we want to distribute on each meal. Typically, you might want to eat less at lunch, and a little bit more at dinner.
			// We will consider you take 2 snacks a day.
			breakfast:0.25,
			snacks:0.15,
			lunch:0.25,
			dinner:0.35
		},
		
		MEALS: ['breakfast', 'snacks', 'lunch', 'dinner'],
		intakeWeigthForDays: {},
		intakesPerMeal: {
			week: {},
			weekend: {}
		},
		WEEKDAYS_PER_WEEK: 5,
		WEEKED_DAYS_PER_WEEK: 2,
		DAYS_PER_WEEK: 7, 

		menu: {
			week: {
				breakfast: {
					allowedCourses: ['Beverages', 'Breakfast and Brunch'],
					suggested_recipes: []	
				},
				snacks:{
					allowedCourses: ['Beverages', 'Side Dishes', 'Lunch and Snacks'],
					suggested_recipes: []
				},
				lunch: {
					allowedCourses: ['Salads', 'Lunch and Snacks', 'Side Dishes', 'Soups'],
					suggested_recipes: []
				},
				dinner: {
					allowedCourses: ['Breads', 'Beverages', 'Soups', 'Condiments and Sauces','Lunch and Snacks', 'Desserts', 'Salads', 'Main Dishes'],
					suggested_recipes: []
				}
			},
			weekend: {
				breakfast: {
					allowedCourses: ['Beverages', 'Breakfast and Brunch'],
					suggested_recipes: []
				},
				snacks: {
					allowedCourses: ['Beverages', 'Breads', 'Lunch and Snacks', 'Side Dishes'],
					suggested_recipes: []
				},
				lunch: {
					allowedCourses: [ 'Beverages', 'Soups', 'Salads','Lunch and Snacks',  'Main Dishes'],
					suggested_recipes: []
				},
				dinner: {
					allowedCourses: ['Beverages', 'Breads', 'Soups', 'Cocktails', 'Lunch and Snacks', 'Condiments and Sauces', 'Desserts', 'Salads', 'Main Dishes'],
					suggested_recipes: []
				}	
			}
		},


		meetsIntakeRequirements: function(recipe, course, week_period, meal) {
			var self = this;
			_.each(recipe.get('nutrients'), function(nutrient) {
				_.filter(self.intakesPerMeal[week_period][meal], function(intake) {
					console.log('intake', intake);
					return true;
				});
			});
			return true;
		},


		initialize: function(options) {
			this.dailyIntake = new DailyIntakeModel();
			this.getIntakeWeigthForDays();
            this.listenTo(this.dailyIntake, 'change', this.distributeDailyIntake);
            Backbone.on('dailyintake:distributed', this.assignRecipes, this);
		},

		assignRecipes: function(){
			var self = this;
			var menu_tmp = {
				week: {},
				weekend: {}
			};

			//For each meal for a certain week period
				//for each allowed course of this meal and week period
					//does  it appear in the list of the courses we retrieved (user input)?
					// If yes
						//save the recipes in the list to consider for the menu 
					// If no
						// we return an empty list, if yes then #2

				// for each of the recipes categories that passed the test #1,
					// for each recipe of that category
						// For each nutrients of this recipe
							// Does any nutrient go over the limit for this particular, meal and this particular week_period ?
								// If yes
									//continue
								// If no
									//add this recipe to the list of possible recipes in the menu for this particular meal and week period.

			_.each(this.menu.week, function(meal, meal_key) {
				console.log('assignRecipes week', 'recipeCollections', self.get('recipeCollections'));
				matching_recipe_collections = _.filter(self.get('recipeCollections'), function(recipe_collection) {
					return _.indexOf(meal.allowedCourses, recipe_collection.type) > -1;
				});
				// console.log('meal', meal, 'matching_recipe_collections', matching_recipe_collections);
				_.each(matching_recipe_collections, function(recipe_collection){
					_.each(recipe_collection.models, function(recipe){
						if (self.meetsIntakeRequirements(recipe, recipe_collection.type, 'week')) {
							self.menu.week[meal_key].suggested_recipes.push(recipe);
						}
					});
				});
			});

			_.each(this.menu.weekend, function(meal, meal_key) {
				console.log('assignRecipes weekend', 'recipeCollections', self.get('recipeCollections'));
				matching_recipe_collections = _.filter(self.get('recipeCollections'), function(recipe_collection) {
					return _.indexOf(meal.allowedCourses, recipe_collection.type) > -1;
				});
				// console.log('meal', meal, 'matching_recipe_collections', matching_recipe_collections);
				_.each(matching_recipe_collections, function(recipe_collection){
					_.each(recipe_collection.models, function(recipe){
						if (self.meetsIntakeRequirements(recipe, recipe_collection.type, 'weekend')) {
							self.menu.weekend[meal_key].suggested_recipes.push(recipe);
						}
					});
				});
			});

			Backbone.trigger('menu:built', this.menu);
			Backbone.trigger('loading:finished');
		},

		buildMenu: function(){
            this.dailyIntake.fetch({reset:true});
		},

		distributeDailyIntake: function () {
			var self = this;

			week_intakes = {};
			weekend_intakes = {};
			_.each(this.MEALS, function(meal) {
				_.each(self.dailyIntake.attributes, function(intake, key){
					// console.log('key',key, 'value', intake.value);
					week_intakes[key] = intake.value * self.intakeWeigthForDays.week * self.intakeWeightsForMeals[meal]
				});
				self.intakesPerMeal.week[meal] = week_intakes;
			});

			_.each(this.MEALS, function(meal) {
				_.each(self.dailyIntake.attributes, function(intake, key){
					// console.log('key',key, 'value', intake.value);
					weekend_intakes[key] = intake.value * self.intakeWeigthForDays.weekend * self.intakeWeightsForMeals[meal]
				});
				self.intakesPerMeal.weekend[meal] = weekend_intakes;
			});
			console.log('distributeDailyIntake', self.intakesPerMeal);
			Backbone.trigger('dailyintake:distributed');
		},

		getIntakeWeigthForDays: function(){
			//This could be per user.
			// Does he want to feast on week ends or not. Basically, we want to set the intake distribution profile.
			// We could still set vitamins and essential nutrients to be fixed per day, but say if we want to have more fatty foods on weekend or some other config
			weekend =  this.DAYS_PER_WEEK / (this.WEEKDAYS_PER_WEEK * this.WEEK_WEEKEND_INTAKE_RATIO + this.WEEKED_DAYS_PER_WEEK);
			week = this.WEEK_WEEKEND_INTAKE_RATIO * weekend;

			this.intakeWeigthForDays = {
				week: week,
				weekend: weekend
			};
		}
	});

	return MenuBuilderModel;
});