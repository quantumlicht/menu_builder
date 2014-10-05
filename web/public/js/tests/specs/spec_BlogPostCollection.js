// Jasmine Unit Testing Suite
// ==========================

define(["app",
        "utils",
        "text!templates/BlogPost.html",
        "views/BlogPostView",
        "models/BlogPostModel",
        "models/CommentModel",
        "collections/ChoreCollection",
        "routers/Router",
        "jasmine-jquery"],

    function(app, utils, template, View, BlogPostModel, CommentModel, ChoreCollection, Router) {

   
        describe("ChoreCollection", function() {

            // Runs before every Collection spec
            beforeEach(function() {
                this.collection = new ChoreCollection();
            });

            it("should contain the correct number of models", function() {

                expect(this.collection.length).toBe(0);

            });


            it('can add Model instances as objects and arrays.', function() {

                this.collection.add({ title: 'new title'});

                // how many this.collection have been added so far?
                expect(this.collection.length).toBe(1);

                this.collection.add([
                    { title: 'Do the laundry', username: 'Philippe' },
                    { title: 'Go to the gym'}
                ]);

                // how many are there in total now?
                expect(this.collection.length).toBe(3);

            });

            it('can have a url property to define the basic url structure for all contained models.', function() {
                expect(this.collection.url).toBe('/blogposts');
            });


            it('should return the models in reverse chronological order', function(){
                this.collection.add([{postDate: new Date('2014-05-01')}, {postDate: new Date('2014-04-01')}, {postDate: new Date('2015-06-01')} ]);
                this.collection.sort();
                expect(this.collection.models[0].get('postDate')).toBeGreaterThan(this.collection.models[1].get('postDate'));
                expect(this.collection.models[0].get('postDate')).toBeGreaterThan(this.collection.models[2].get('postDate'));
                
                expect(this.collection.models[1].get('postDate')).toBeLessThan(this.collection.models[0].get('postDate'));
                expect(this.collection.models[1].get('postDate')).toBeGreaterThan(this.collection.models[2].get('postDate'));
                
                expect(this.collection.models[2].get('postDate')).toBeLessThan(this.collection.models[0].get('postDate'));
                expect(this.collection.models[2].get('postDate')).toBeLessThan(this.collection.models[1].get('postDate'));

            });
        });

});