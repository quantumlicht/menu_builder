// IndexView.js

define([
    "app",
    "utils",
    "models/MenuModel",
    "views/RecipeListView",
    "text!templates/RecipeSelection.html",
    "text!templates/CourseSelection.html"
    ],

    function( app,
            utils,
            MenuModel,
            RecipeListView,
            RecipeSelectionTemplate,
            CourseSelectionTemplate) {

        var RecipeSelectionView = Backbone.View.extend({

            template: Handlebars.compile(RecipeSelectionTemplate),
            courseSelectionTemplate: Handlebars.compile(CourseSelectionTemplate),
            // View constructor
            initialize: function() {
                this.render();
                this.menuModel = new MenuModel();
                Backbone.on('loading:finished', this.hideLoading, this);
                Backbone.on('loading:started', this.showLoading, this);
                Backbone.on('menu:built', this.renderMenu, this);
                Backbone.on('menu:ready', this.enableSubmit, this);
                Backbone.on('menu:busy', this.disableSubmit, this);
                Backbone.on('menu:progress', this.updateProgress, this);

                this.listenTo(this.menuModel.courseCollection, 'reset', this.renderCourseSelection);
                this.renderCourseSelection(this.menuModel.courseCollection);
            },

            // View Event Handlers
            events: {
                "th-ready": 'ready',    
                "click #select_menu": "get_menu"
            },


            get_menu: function(e){
                e.preventDefault();
                var self = this;
                this.$el.find('.recipeListsContainer').html('');
                this.setIngredientFilters();
                this.setMaxCookingTime();
                this.setPreferredCourses();
                this.menuModel.buildMenu();
            },

            renderMenu: function(menu) {
                var self = this;
               console.log('RecipeSelectionView', 'get_menu', 'menu', menu);

                _.each(menu.week, function(meal, meal_key) {
                    recipeList = new RecipeListView({
                        recipes: meal.suggested_recipes,
                        type: meal_key,
                        identifier: meal_key + '-week',
                        week_period: 'week'
                    });
                    self.$el.find('.recipeListsContainer').append(recipeList.render().$el);
                });
            },

            renderCourseSelection: function(courses){
                this.$el.find('#courseSelection').html(this.courseSelectionTemplate({courses: courses.toJSON()}));
            },

            ready: function(){
                typeaheads = $('select.typeahead');
                _.each(typeaheads, function(typeahead, id) {
                    var type = ($(typeahead).attr('meta-type')).split(' ')[0];

                    $(typeahead).selectize({
                        plugins: ['remove_button'],
                        valueField: 'description',
                        labelField: 'description',
                        searchField: 'description', 
                        preload:true,
                        maxItems:null,
                        render: {
                            option: function(item, escape) {
                                return '<div>' +
                                    '<span class="description">' + escape(item.description) + '</span>' +
                                '</div>';
                            }
                        },
                        load: function(query, callback) {
                            if (!query.length) return callback();
                            $.ajax({
                                timeout: app.ASYNC_REQ_TIMEOUT,
                                url:  'http://localhost:2000/metadata/' + type,
                                
                                type: 'GET',

                                beforeSend: function(){
                                    Backbone.trigger('loading:started');
                                },
                                
                                error: function() {
                                    console.log('ready load', 'error');
                                    $('.loading_animation').hide();
                                    utils.showAlert('Error!', 'Could not show ingredients list', 'alert-danger');
                                    callback();
                                },
                                
                                success: function(res) {
                                    console.log('ready load', 'success');
                                    // parsedResults = res.map(function(elem){
                                    //     return elem.description;
                                    // });
                                    // console.log('success', parsedResults);
                                    Backbone.trigger('loading:finished');
                                    callback(res);
                                }
                            });
                        }
                    });
 
                });
            },

            hideLoading: function(){
                $('.loading_animation').hide();
                // $('.progress').hide();
            },

            showLoading: function(){
                $('.loading_animation').show();
                $('.progress').show();
            },

            updateProgress: function(data) {
                $('.progress-bar').css('width', data.progress + '%');
                $('.progressMessage').text('Finished processing: ' + data.type);
            },

            enableSubmit: function(){
                $('button#select_menu').button('reset');
            },

            disableSubmit: function(){
                $('button#select_menu').button('loading');
            },

            setMaxCookingTime: function() {
                var max_time = this.$el.find('#max_time').val();
                // TODO ADD PROPER VALIDATION
                this.menuModel.max_cook_time = max_time * 60;
            },

            setIngredientFilters: function() {
                var filter_out = this.$el.find('#ingredient-neg').val();
                var filter_in = this.$el.find('#ingredient-pos').val();
                var same = _.intersection(filter_out, filter_in);
                if (same.length > 0) {
                    utils.showAlert('Error!', 'You defined the same elements: <b>' + same.join(', ') + '</b> for the thing you like and don\'t like', 'alert-danger');
                }

                this.menuModel.ingredient_filters = {
                    include: filter_in,
                    exclude: filter_out
                };
            },

            setPreferredCourses: function() {
                var courses = this.$el.find('input.course-select');
                var preferredCourses = [];
                _.each(courses, function(course){
                    if (course.checked) {
                        preferredCourses.push(course.value);
                    }
                });
                console.log('setPreferredCourses','preferredCourses', preferredCourses);
                this.menuModel.preferredCourses = preferredCourses;
            },


            // Renders the view's template to the UI
            render: function() {
                this.$el.html(this.template);
                // console.log($('.typeahead'));
                
                // // this.listView = new ChoreListView();
                // // this.$el.append(this.listView.$el);
                // // this.listView.render();
            }

        });

        // Returns the View class
        
        return RecipeSelectionView;

    }

);
