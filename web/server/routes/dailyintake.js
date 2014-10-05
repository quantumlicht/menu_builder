var DAILY_INTAKES = {
    KCAL: {name:'Calories', value: 2000, displayValue:	'2000 cal'},
    FAT: {name:'Total Fat', value: 65, displayValue:	'65 g'},
	FATSAT: {name:'Saturated Fatty Acids', value: 20, displayValue:'20 g'},
    CHOLE: {name:'Cholesterol', value: 300, displayValue:'300 mg'},
	NA: {name:'Sodium', value: 2400, displayValue: '2400 mg'},
	K: {name:'Potassium', value: 4700, displayValue: '4700 mg'},
	CHOCDF: {name:'Total Carbohydrate', value: 300, displayValue: '300 g'},
	FIBTG:{name:'Dietary Fiber', value: 25, displayValue: '25 g'},
	PROCNT: {name:'Protein', value: 50, displayValue: '50 g'},	
	VITA_RAE:{name:'Vitamin A', value: 900, displayValue: '900&mu;g'},
    VITC: {name:'Ascorbic Acid Vitamin C', value: 60, displayValue: '60 mg'},
    CA: {name:'Calcium', value: 1000, displayValue: '1000 mg'},
    FE:{name:'Iron', value: 18, displayValue: '18 mg'},
    VITD: {name:'Cholecalciferol Vitamin D', value: 400, displayValue: '400 I'},
    TOCPHA:{name:'Tocopherol Vitamin E', value: 30, displayValue: '30 I'},
    VITK:{name:'Vitamin K', value: 80, displayValue: '80&mu;g'},
    THIA:{name:'Thiamin Vitamin B1', value: 1.5, displayValue: '1.5 mg'},
    RIBF:{name:'Riboflavin Vitamin B2', value: 1.7, displayValue: '1.7 mg'},
    NIA:{name:'Niacin Vitamin B3', value: 20, displayValue:	'20 mg'},
    VITB6A:{name:'Pyridoxine Vitamin B6', value: 2, displayValue:	'2 mg'},
    FOLDFE:{name:'Folate', value: 400, displayValue:	'400&mu;g'},
    VITB12:{name:'Cobalamine Vitamin B12', value: 6, displayValue:	'6&mu;g'},
    P:{name:'Phosphorus', value: 1000, displayValue:	'1000 mg'},
    MG:{name:'Magnesium', value: 400, displayValue:	'400 mg'},
    ZN:{name:'Zinc', value: 15, displayValue: '15 mg'},
    SE:{name:'Selenium', value: 70, displayValue: '70&mu;g'},
    CU:{name:'Copper', value: 2000, displayValue: '2000&mu;g'},
    MN:{name:'Manganese', value: 2, displayValue: '2 mg'}
}

module.exports = function(server) {
	server.get('/dailyintake/reference', function(req, res){
			console.log('GET /dailyintake/reference');
			return res.json(DAILY_INTAKES);
	});
};


