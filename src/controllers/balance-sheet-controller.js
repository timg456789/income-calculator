const AccountSettingsController = require('./account-settings-controller');
const balanceSheetView = require('../views/balance-sheet/balance-sheet-view');
const BondViewModel = require('../views/balance-sheet/bond-view-model');
const CashOrStockViewModel = require('../views/balance-sheet/cash-or-stock-view-model');
const Currency = require('currency.js');
const DataClient = require('../data-client');
const homeView = require('../home-view');
const LoanViewModel = require('../views/balance-sheet/loan-view-model');
const Util = require('../util');
function HomeController() {
    'use strict';
    let s3ObjKey;
    let dataClient;
    async function refresh() {
        try {
            let data = await dataClient.getData();
            let totalCashAndStocks = Currency(0).toString();
            totalCashAndStocks = new CashOrStockViewModel().getAssetTotal(data.assets);
            balanceSheetView.setView(data, totalCashAndStocks);
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
        if (s3ObjKey) {
            refresh();
        }
    };
}

module.exports = HomeController;