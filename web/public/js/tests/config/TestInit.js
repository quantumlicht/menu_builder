// TestInit.js
if (typeof DEBUG === 'undefined') DEBUG = false;

require.config({

  // Sets the js folder as the base directory for all future relative paths
  baseUrl: "./js",

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {

      // Core Libraries
      // ==============

      "jquery": "libs/jquery/dist/jquery",
      
      "underscore": "libs/lodash/dist/lodash",

      "lodash": "libs/lodash/dist/lodash",

      "backbone": "libs/backbone/backbone",

      "handlebars": "libs/handlebars/handlebars",

      "bootstrap": "libs/bootstrap/dist/js/bootstrap",

      "jasmine": "libs/jasmine/lib/jasmine-core/jasmine",

      "jasmine-html": "libs/jasmine/lib/jasmine-core/jasmine-html",

      "hbar_helpers": "app/hbar_helpers",
      
      "boot": "libs/jasmine/lib/jasmine-core/boot",


      // Plugins
      // =======

      "backbone.validateAll": "libs/plugins/Backbone.validateAll",

      "text": "libs/text/text",

      "facebook": "//connect.facebook.net/en_US/all",

      "jasmine-jquery": "libs/jasmine-jquery/lib/jasmine-jquery",
      
      "app": "app/app",

      "utils": "app/utils",


      // Application Folders
      // ===================

      "collections": "app/collections",

      "models": "app/models",

      "routers": "app/routers",

      "templates": "app/templates",

      "views": "app/views",

      "events": "app/events/Notifier"

  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {

      // Jasmine-jQuery plugin
      "jasmine-jquery": ["jquery"],

      // Backbone
      "backbone": {

          // Lists jQuery and Underscore as dependencies
          "deps": ["underscore", "jquery"],

          // Exports the global 'window.Backbone' object
          "exports": "Backbone"

      },

      "facebook" : {
         exports: "FB"
      },

      "bootstrap": ["jquery"],

      // Backbone.validateAll depends on Backbone
      "backbone.validateAll": ["backbone"],

      // Jasmine Unit Testing
      "jasmine": {

        // Exports the global 'window.jasmine' object
        exports: "window.jasmineRequire"

      },

      // Jasmine Unit Testing helper
      "jasmine-html": {

        deps: ["jasmine"],

        exports: "window.jasmineRequire"

      },

      "boot": {
        deps: ['jasmine', 'jasmine-html'],
        exports: 'window.jasmineRequire'
      }

  }

});

var specs = [];

specs.push('tests/specs/spec_BlogPostModel');
specs.push('tests/specs/spec_BlogPostModel_Behavior');
specs.push('tests/specs/spec_CommentModel');
specs.push('tests/specs/spec_SessionModel');
specs.push('tests/specs/spec_view');
specs.push('tests/specs/spec_ChoreCollection');
specs.push('tests/specs/spec_CommentCollection');
specs.push('tests/specs/spec_TriviaCollection');
specs.push('tests/specs/spec_UserCollection');
specs.push('tests/specs/spec_router');
// Include JavaScript files here (or inside of your router)
require(["app",
         "utils",
         "hbar_helpers",
         "routers/Router",
         "models/SessionModel",
         "boot",
         "events",
         "backbone.validateAll"],

  function(app, utils, hbar_helpers, Router, SessionModel, boot) {
     // Instantiates a new Desktop Router instance
      app.router = new Router();
      app.session = new SessionModel();

      // Check the auth status upon initialization,
      // before rendering anything or matching routes
      app.session.checkAuth({
         // Start the backbone routing once we have captured a user's auth status
         complete: function(){
            // HTML5 pushState for URLs without hashbangs
            var hasPushstate = !!(window.history && history.pushState);
            if(hasPushstate){
               Backbone.history.start({ pushState: true} );
               // Backbone.history.start(); 
            } 
            else Backbone.history.start();   
         }
      });   

    require(specs, function() {
      window.onload();  
      // jasmine_html.getEnv().addReporter(new jasmine_html.TrivialReporter());

      // jasmine_html.getEnv().execute();

    });
  }

);