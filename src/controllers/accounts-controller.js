const homeView = require('../home-view');
const balanceSheetView = require('../views/balance-sheet-view');
const DataClient = require('../data-client');
const AccountSettingsController = require('./account-settings-controller');
const Util = require('../util');
function AccountsController() {
    'use strict';
    let s3ObjKey;
    let dataClient;
    async function refresh() {
        try {
            let data = await dataClient.getData();
            homeView.setView(data);
        } catch (err) {
            Util.log(err);
        }
    }
    this.init = function (settings) {
        s3ObjKey = settings.s3ObjectKey;
        dataClient = new DataClient(settings);
        new AccountSettingsController().init(settings, balanceSheetView);
        if (s3ObjKey) {
            refresh();
        }
    };
}

module.exports = AccountsController;