/**
 * @desc        app globals
 */
define([
    "jquery",
    "underscore",
    "backbone",
    "events",
    "utils",
    "handlebars"
],
function($, _, Backbone, notifier) {
    var self = this;


    //Overriding console log
    // (function(){
    // if(window.console && console.log){
    //     var old = console.log;
    //     console.log = function(){
    //         Array.prototype.unshift.call(arguments, 'Report: ');
    //         old.apply(this, arguments)
    //     }
    // }  
    // })();


    var app = {
        root : "/menage",                     // The root path to run the application through.
        URL : "/menage",                      // Base application URL
        API : "/api",
        maxTextLength: 95,
        MIN_RESULTS: 5,
        ASYNC_REQ_TIMEOUT: 1000
    };


    $.ajaxSetup({ cache: false });          // force ajax call on all browsers


    // Global event aggregator
    app.eventAggregator = notifier;

    return app;

});