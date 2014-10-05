// Init.js
// =======

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

      "jquery-cookie": "libs/jquery-cookie/jquery.cookie",

      "underscore": "libs/lodash/dist/lodash",

      "backbone": "libs/backbone/backbone",

      "marionette": "libs/marionette/lib/backbone.marionette",

      "handlebars": "libs/handlebars/handlebars",

      "bootstrap": "libs/bootstrap/dist/js/bootstrap",

      "app": "app/app",

      "google": "app/google",

      "utils": "app/utils",

      "selectize": "libs/selectize/dist/js/standalone/selectize.min",

      "hbar_helpers": "app/hbar_helpers",


      // Plugins
      // =======

      "backbone.validateAll": "libs/plugins/Backbone.validateAll",
      "backbone.paginator": "libs/backbone.paginator/lib/backbone.paginator",

      "text": "libs/text/text",

      "facebook": "//connect.facebook.net/en_US/all",


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

      "utils" : {
         exports: 'utils'
      },
      // Bootstrap
      "bootstrap": ["jquery"],

      // Backbone
      "backbone": {

        // Depends on underscore/lodash and jQuery
        "deps": ["underscore", "jquery"],

        // Exports the global window.Backbone object
        "exports": "Backbone"

      },

      "facebook" : {
         exports: "FB"
      },
      
      'handlebars': {
        exports: 'Handlebars'
      },

      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"]
   }

});
// require(['newrelic']);
// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["app", "hbar_helpers", "routers/Router",
         "models/SessionModel", "bootstrap",
         "backbone.validateAll", "backbone.paginator",
         "jquery-cookie", "selectize"],

   function(app, hbar_helpers, Router, sessionModel) {
    
      // Main
      // Backbone.emulateHTTP = true;

      // Instantiates a new Desktop Router instance
      app.router = new Router();
      app.session = new sessionModel();

      // Check the auth status upon initialization,
      // before rendering anything or matching routes
      app.session.checkAuth({

         // Start the backbone routing once we have captured a user's auth status
         complete: function(){
            // HTML5 pushState for URLs without hashbangs
            var hasPushstate = !!(window.history && history.pushState);
            if(hasPushstate){
               // Backbone.history.start({ pushState: true, root: '/' } );
               Backbone.history.start(); 
            } 
            else Backbone.history.start();   
         }
      });   

      $('#content-app').on("click", "a:([data-bypass])", function(evt) {
         console.log('Init', 'data bypass');
         evt.preventDefault();
         var href = $(this).attr("href");
         app.router.navigate(href, { trigger : true, replace : false } );
      });


      // window.onhashchange = function(){ 
      //    $('ul.navbar-nav').find('li').removeClass('active');
      //    $('#loc-' + Backbone.history.fragment).addClass('active');
      // };
   }
);
