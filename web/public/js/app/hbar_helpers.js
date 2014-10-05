define(["app"], function(app) {


	Handlebars.registerHelper('formatDate', function(to_check) {
        var SECOND_IN_MS = 1 *1000,
        MINUTE_IN_MS     = 60 * SECOND_IN_MS,
        HOUR_IN_MS       = 60 * MINUTE_IN_MS,
        DAY_IN_MS        = 24 * HOUR_IN_MS,
        YEAR_IN_MS       = 365 * DAY_IN_MS;

        var FUTURE_MODIFIER = 'dans ',
        PAST_MODIFIER       = 'il y a ';

        var now = new Date().getTime();
        var date = new Date(to_check).getTime();
        
        var diff = now - date;
        var in_future = false;
        var res, suffix;
        if (diff < 0) {
            diff = -1 * diff;
            in_future = true;
        }

        if (diff < SECOND_IN_MS) {
            return 'À l\'instant';
        }
        else if (diff <= MINUTE_IN_MS - SECOND_IN_MS) {
            res = (diff / SECOND_IN_MS).toFixed();
            suffix = res == 1 ? ' seconde': ' secondes';
        }
        else if (diff  <= HOUR_IN_MS - MINUTE_IN_MS) {
            res = (diff / MINUTE_IN_MS).toFixed();
            suffix = res == 1 ? ' minute': ' minutes';
        }
        else if (diff < DAY_IN_MS - HOUR_IN_MS ) {
            res = (diff / HOUR_IN_MS).toFixed();
            suffix = res == 1 ? ' heure': ' heures';
        }
        else if (diff < YEAR_IN_MS - DAY_IN_MS) {
            res = (diff / DAY_IN_MS).toFixed();
            suffix = res == 1 ? ' jour': ' jours';
        }
        else if (diff > YEAR_IN_MS - DAY_IN_MS) {
            res = (diff / YEAR_IN_MS).toFixed();
            suffix = res == 1 ? ' année': ' années';

        }
        
        return in_future ? FUTURE_MODIFIER + res + suffix : PAST_MODIFIER + res + suffix;

        // return new Date(String(date)).toLocaleString();
    });


    Handlebars.registerHelper('normL', function(text, length) {
        length = typeof length ==='object' ? app.maxTextLength : length;

        var shortenedText = text.slice(0, length);
        if (text.length > length) {
            shortenedText += "...";
        }
        return shortenedText;
    });
    
});
