const HomeController = require('./home-controller');
const BalanceSheetController = require('./balance-sheet-controller');
const PayDaysController = require('./pay-days-controller');
const Nav = require('./nav');

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

    Nav.initNav($('.tab-nav-bar'));

    var settings = {};
    var optionalOverride = getParameterByName('data');
    if (optionalOverride) {
        settings.s3ObjectKey = optionalOverride;
    }

    settings.pub = getParameterByName('pub');
    settings.priv = getParameterByName('priv');
    settings.s3Bucket = getParameterByName('s3Bucket');
    settings.agreedToLicense = getParameterByName('agreedToLicense') === 'true';

    let controller;
    if (window.location.href.split('/').pop().toLocaleLowerCase().startsWith('index.html')) {
        controller = new HomeController();
    } else if (window.location.href.split('/').pop().toLocaleLowerCase().startsWith('balance-sheet.html')) {
        controller = new BalanceSheetController();
    } else if (window.location.href.split('/').pop().toLocaleLowerCase().startsWith('pay-days.html')) {
        controller = new PayDaysController();
    }

    controller.init(settings);

});
