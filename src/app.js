const HomeController = require('./home-controller');
const BalanceSheetController = require('./balance-sheet-controller');

function getParameterByName(name) {
    'use strict';

    var url = location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return results[2];
}

$(document).ready(function () {
    'use strict';

    var settings = {};
    var optionalOverride = getParameterByName('data');
    if (optionalOverride) {
        settings.s3ObjectKey = optionalOverride;
    }

    settings.pub = getParameterByName('pub');
    settings.priv = getParameterByName('priv');
    settings.s3Bucket = getParameterByName('s3Bucket');
    settings.agreedToLicense = getParameterByName('agreedToLicense') === 'true';

    var controller;
    if (window.location.href.split('/').pop().toLocaleLowerCase().startsWith('index.html')) {
        controller = new HomeController();
    } else {
        controller = new BalanceSheetController();
    }
    controller.init(settings);

});
