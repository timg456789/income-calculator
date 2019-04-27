const HomeController = require('./controllers/home-controller');
const BalanceSheetController = require('./controllers/balance-sheet-controller');
const PayDaysController = require('./controllers/pay-days-controller');
const AccountsController = require('./controllers/accounts-controller');
const Nav = require('./nav');
const AccountSettingsView = require('./views/account-settings-view');

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
    } else if (window.location.href.split('/').pop().toLocaleLowerCase().startsWith('accounts.html')) {
        controller = new AccountsController();
    }


    $('#command-buttons-container').append(AccountSettingsView.getCommandButtonsContainerView());
    $('#account-settings-container').append(AccountSettingsView.getAccountSettingsView());

    controller.init(settings);

});
