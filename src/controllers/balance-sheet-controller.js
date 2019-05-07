const homeView = require('../home-view');
const balanceSheetView = require('../views/balance-sheet/balance-sheet-view');
const LoanViewModel = require('../views/balance-sheet/loan-view-model');
const CashOrStockViewModel = require('../views/balance-sheet/cash-or-stock-view-model');
const BondViewModel = require('../views/balance-sheet/bond-view-model');
const DataClient = require('../data-client');
const AccountSettingsController = require('./account-settings-controller');
const Util = require('../util');
function HomeController() {
    'use strict';
    let s3ObjKey;
    let dataClient;
    async function refresh() {
        try {
            let data = await dataClient.getData();
            balanceSheetView.setView(data);
        } catch (err) {
            Util.log(err);
        }
    }
    this.init = function (settings) {
        s3ObjKey = settings.s3ObjectKey;
        dataClient = new DataClient(settings);
        new AccountSettingsController().init(settings, balanceSheetView);
        $('#add-new-balance').click(function () {
            $('#balance-input-group').append(new LoanViewModel().getView(100, 'new balance', '.035'));
        });
        $('#add-new-asset').click(function () {
            $('#asset-input-group').append(new CashOrStockViewModel().getView(100, 'new asset'));
        });
        if (s3ObjKey) {
            refresh();
        }
    };
}

module.exports = HomeController;