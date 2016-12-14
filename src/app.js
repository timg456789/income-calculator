const $ = require('jquery');
const cal = require('income-calculator/src/calendar');
var HomeController = require('./home-controller');
var homeController = new HomeController();

function getParameterByName(name, url) {
    'use strict';

    url = location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function () {
    'use strict';

    var s3ObjectKey;
    var optionalOverride = getParameterByName('data');
    if (optionalOverride) {
        s3ObjectKey = optionalOverride;
    }

    var pub = getParameterByName('pub');
    var priv = getParameterByName('priv');

    homeController.init(s3ObjectKey, pub, priv);

    $('.alert-dismissible > button.close').click(function () {
        $(this).parent().remove();
    });

});
