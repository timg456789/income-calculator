const AccountSettingsController = require('./account-settings-controller');
const balanceSheetView = require('../views/balance-sheet/balance-sheet-view');
const CashOrStockViewModel = require('../views/balance-sheet/cash-or-stock-view-model');
const DataClient = require('../data-client');
const LoanViewModel = require('../views/balance-sheet/loan-view-model');
const Util = require('../util');
function HomeController() {
    'use strict';
    let s3ObjKey;
    let dataClient;
    async function refresh() {
        try {
            let data = dataClient.getData();
            let bankData = sendRequest();
            data = await data;
            bankData = await bankData;
            balanceSheetView.setView(data, bankData);
        } catch (err) {
            Util.log(err);
        }
    }
    async function sendRequest() {
        let requestParams = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': Util.getCookie('idToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // body data type must match "Content-Type" header
        };
        let responseData;
        try {
            let response = await fetch('https://9hls6nao82.execute-api.us-east-1.amazonaws.com/production', requestParams);
            console.log(response);
            responseData = await response.json(); // parses JSON response into native JavaScript objects
        } catch (error) {
            console.log(error);
            console.log('token is likely invalid causing cors to fail');
            window.location=`${Util.rootUrl()}/pages/login.html${window.location.search}`;
        }
        return responseData;
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