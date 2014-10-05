/**
 * @desc        Common helper functions/utilities
 *              ex/ cookie helpers, alerting utils, localStorage support, etc
 */

define([
    "app"
    ],

    function(app) {

    var utils = utils || {  
        /*
        * JAVASCRIPT TEXT UTILS
        */
        //from http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the
        applyHyperLinks: function(string_to_test) {
            var url_regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/i;
            return string_to_test.replace(url_regexp, "<a href='$1'>$1</a>");
        },

        getNumberPositionString: function(number) {
            var mod = number % 10;
            if (mod == 1) return 'st';
            else if (mod == 2) return 'nd';
            else if (mod === 3) return 'rd';
            else return 'th';
        },

        // Show alert classes and hide after specified timeout
        showAlert: function(title, text, klass) {
            $("#header-alert").removeClass("alert-danger alert-warning alert-success alert-info");
            $("#header-alert").addClass(klass);
            $("#header-alert").html('<button class="close" data-dismiss="alert">×</button><strong>' + title + '</strong> ' + text);
            $("#header-alert").show('fast');
            setTimeout(function() {
                $("#header-alert").hide(1000);
            }, 7000 );
        },

        /*
         * ERRORS and ALERT HANDLING
         */ 
         
        // Default alert when there is a validation error
        displayValidationErrors: function (messages) {
            for (var key in messages) {
                if (messages.hasOwnProperty(key)) {
                    this.addValidationError(key, messages[key]);
                }
            }
            this.showAlert('Uh oh...', 'Please fix validation errors and try again.', 'alert-error');
        },

        addValidationError: function (field, message) {
            var controlGroup = $('#' + field).parent().parent();
            controlGroup.addClass('error');
            $('.help-block', controlGroup).html(message);
        },

        removeValidationError: function (field) {
            var controlGroup = $('#' + field).parent().parent();
            controlGroup.removeClass('error');
            $('.help-block', controlGroup).html('');
        },
        
        
        jsonResponse: function(code){
            var jsonCodes = [];
            jsonCodes[400] = 'Unrecognized command';
            jsonCodes[401] = 'Permission denied';
            jsonCodes[402] = 'Missing argument';
            jsonCodes[401] = 'Incorrect password';
            jsonCodes[404] = 'Account not found';
            jsonCodes[405] = 'Email not validated';
            jsonCodes[408] = 'Token expired';
            jsonCodes[411] = 'Insufficient privileges';
            jsonCodes[500] = 'Internal server error';
            return jsonCodes[code];
        },

        supportsLocalStorage: function () {
            return ('localStorage' in window) && window.localStorage !== null;
        },

        getQueryParam : function(name, queryStr){
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(queryStr || window.location.search);
            if(results === null)
                return "";
            else
               return decodeURIComponent(results[1].replace(/\+/g, " "));
        },

        /*
         * COOKIE HELPERS
         */
        readCookie : function(name){
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++){
                var c = ca[i];
                while (c.charAt(0)==' '){
                    c = c.substring(1,c.length);
                }

                if (c.indexOf(nameEQ) === 0){
                    return c.substring(nameEQ.length,c.length);
                }
            }
            return null;
        },

        eraseCookie : function(name, domain){
            // set to epoch in the past for deletion
            //console.log("Removing cookie:: "+ name+"=;path=/"+( (domain) ?";domain="+domain : "" )+";expires=Thu, 01 Jan 1970 00:00:01 GMT");
            document.cookie = name+"=;path=/"+( (domain) ?";domain="+domain : "" )+";expires=Thu, 01 Jan 1970 00:00:01 GMT";
        },

        createCookie : function (name,value,days){
            var expires;
            if (days){
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                expires = "; expires="+date.toGMTString();
            }
            else {
                expires = "";
            }

            document.cookie = name+"="+value+expires+"; path=/";
        }
    };

    return utils;
    
});