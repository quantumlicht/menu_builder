// Jasmine Unit Testing Suite
// ==========================

define(["app",
        "utils",
        "text!templates/BlogPost.html",
        "views/BlogPostView",
        "models/BlogPostModel",
        "models/CommentModel",
        "collections/CommentCollection",
        "routers/Router",
        "jasmine-jquery"],

    function(app, utils, template, View, BlogPostModel, CommentModel, CommentCollection, Router) {

   
        describe("CommentCollection", function() {

            // Runs before every Collection spec
            beforeEach(function() {
                this.collection = new CommentCollection();
            });

            it("should contain the correct number of models", function() {

                expect(this.collection.length).toBe(0);

            });


            it('can add Model instances as objects and arrays.', function() {

                this.collection.add({ content: 'new title'});

                // how many this.collection have been added so far?
                expect(this.collection.length).toBe(1);

                this.collection.add([
                    { content: 'Do the laundry', username: 'Philippe' },
                    { content: 'Go to the gym'}
                ]);

                // how many are there in total now?
                expect(this.collection.length).toBe(3);

            });

            it('can have a url property to define the basic url structure for all contained models.', function() {
                expect(this.collection.url).toBe('/comments');
            });
        });

});