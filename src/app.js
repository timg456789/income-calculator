const HomeController = require('./controllers/home-controller');
const BalanceSheetController = require('./controllers/balance-sheet-controller');
const PayDaysController = require('./controllers/pay-days-controller');
const AccountsController = require('./controllers/accounts-controller');
const Nav = require('./nav');
const AccountSettingsView = require('./views/account-settings-view');
const Util = require('./util');

$(document).ready(function () {
    'use strict';
    Nav.initNav($('.tab-nav-bar'));
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
    controller.init(Util.settings());
});
