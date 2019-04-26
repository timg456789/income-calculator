const homeView = require('./home-view');
const balanceSheetView = require('./views/balance-sheet-view');
const BalanceViewModel = require('./balance-view-model');
const AssetViewModel = require('./asset-view-model');
const BondViewModel = require('./bond-view-model');
const DataClient = require('./data-client');
const AccountSettingsController = require('./controllers/account-settings-controller');
const Util = require('./util');

function HomeController() {
    'use strict';
    let s3ObjKey;
    let dataClient;

    async function save() {
        let data = balanceSheetView.getModel();
        try {
            let response = await dataClient.patch(s3ObjKey, data);
            window.location='./balance-sheet.html'+window.location.search;
        } catch (err) {
            Util.log(err);
        }
    }

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
        $('#project').click(function () {
            if (Util.agreedToLicense()) {
                save();
            }
        });
        $('#add-new-balance').click(function () {
            $('#balance-input-group').append(BalanceViewModel.getBalanceView(100, 'new balance', '.035'));
        });
        $('#add-new-asset').click(function () {
            $('#asset-input-group').append(AssetViewModel.getBalanceView(100, 'new asset'));
        });
        $('#add-new-bond').click(function () {
           $('#bond-input-group').append(BondViewModel.getBondView({ amount: 100, issueDate: new Date().toISOString()}));
        });
        if (s3ObjKey) {
            refresh();
        }
    };
}

module.exports = HomeController;