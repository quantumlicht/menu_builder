define([
	"app",
	"utils"
],
	function( app,utils) {

		var DailyIntake = Backbone.Model.extend({
            url: 'dailyintake/reference'
		});

		return DailyIntake;
	}
);