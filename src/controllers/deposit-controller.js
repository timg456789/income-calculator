const DataClient = require('../data-client');
const Moment = require('moment');
const Util = require('../util');
const Currency = require('currency.js');
function DepositController() {
    'use strict';
    let dataClient;
    let settings;
    async function deposit(amount) {
        let dataClient = new DataClient(settings);
        let data = await dataClient.getData();
        let cashAsset = data.assets.find(x => x.name.toLowerCase() === "cash");
        if (!cashAsset) {
            cashAsset = {name: 'Cash', sharePrice: '1', 'shares': '0'};
        }
        let shares = Currency(cashAsset.shares);
        cashAsset.shares = shares.add(amount).toString();
        let patch = { assets: data.assets };
        await dataClient.patch(settings.s3ObjectKey, patch);
        window.location.reload();
    }
    async function initAsync() {
        let defaultTransactionDate = Moment().add(1, 'days').format('YYYY-MM-DD UTC Z');
        $('.transfer-date').val(defaultTransactionDate);
        $('#submit-transfer').click(function() {
            deposit($('#transfer-amount').val().trim());
        });
    }
    this.init = function (settingsIn) {
        settings = settingsIn;
        dataClient = new DataClient(settings);
        initAsync()
            .catch(err => { Util.log(err); });
    };
}

module.exports = DepositController;