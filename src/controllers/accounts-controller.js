const AccountSettingsController = require('./account-settings-controller');
const AccountsView = require('../views/accounts-view');
const AvailableBalanceCalculator = require('../calculators/available-balance-calculator');
const balanceSheetView = require('../views/balance-sheet/balance-sheet-view');
const Currency = require('currency.js');
const DataClient = require('../data-client');
const Util = require('../util');
function AccountsController() {
    'use strict';
    let dataClient;
    let settings;
    function cancelTransfer(transferId) {
        let dataClient = new DataClient(settings);
        dataClient.getData()
            .then(data => {
                let patch = {};
                patch.pending = data.pending.filter(x => x.id != transferId);
                return dataClient.patch(settings.s3ObjectKey, patch);
            })
            .then(putResult => { window.location.reload(); })
            .catch(err => { Util.log(err); });
    }
    async function completeTransfer(transferId) {
        let dataClient = new DataClient(settings);
        let data = await dataClient.getData();
        let patch = {};
        let transferOriginal = data.pending.find(x => x.id === transferId);
        patch.pending = data.pending.filter(x => x.id !== transferId);
        var debitAccount = data.assets.find(x => x.name.toLowerCase() === transferOriginal.debitAccount.toLowerCase());
        if (transferOriginal.type && transferOriginal.type.toLowerCase() === 'expense') {
            debitAccount = data.cash.find(x => x.name.toLowerCase() === transferOriginal.debitAccount.toLowerCase());
            debitAccount.amount = Currency(debitAccount.amount, Util.getCurrencyDefaults()).subtract(transferOriginal.amount).toString();
            if (Currency(debitAccount.amount).intValue < 1) {
                data.cash = data.cash.filter(x => x.name.toLowerCase() !== debitAccount.name.toLowerCase());
            }
            patch.cash = data.cash;
        } else if (transferOriginal.type && transferOriginal.type.toLowerCase() === 'bond') {
            debitAccount.shares = Currency(debitAccount.shares).subtract(transferOriginal.amount).toString();
            patch.bonds = data.bonds || [];
            delete transferOriginal.creditAccount;
            delete transferOriginal.debitAccount;
            delete transferOriginal.transferDate;
            patch.bonds.push(transferOriginal);
        } else if (transferOriginal.type && transferOriginal.type.toLowerCase() === 'cash') {
            debitAccount.shares = Currency(debitAccount.shares, Util.getCurrencyDefaults()).subtract(transferOriginal.amount).toString();
            patch.cash = data.cash || [];
            let creditAccount = patch.cash.find(x => x.name.toLowerCase() === transferOriginal.creditAccount.toLowerCase());
            if (!creditAccount) {
                patch.cash.push({
                    amount: transferOriginal.amount,
                    name: transferOriginal.name
                });
            } else {
                creditAccount.amount = Currency(creditAccount.amount, Util.getCurrencyDefaults()).add(transferOriginal.amount).toString();
            }
        } else if (transferOriginal.type && transferOriginal.type.toLowerCase() === 'property-plant-and-equipment') {
            debitAccount.shares = Currency(debitAccount.shares, Util.getCurrencyDefaults()).subtract(transferOriginal.amount).toString();
            patch.propertyPlantAndEquipment = data.propertyPlantAndEquipment || [];
            patch.propertyPlantAndEquipment.push({
                amount: transferOriginal.amount,
                name: transferOriginal.name
            });
        } else {
            let newDebitAmount = Currency(Util.getAmount(debitAccount), Util.getCurrencyDefaults()).subtract(Util.getAmount(transferOriginal)).toString();
            debitAccount.shares = Currency(newDebitAmount, Util.getCurrencyDefaults()).divide(debitAccount.sharePrice).toString();
            let creditAccount = data.assets.find(x => x.name.toLowerCase() === transferOriginal.creditAccount.toLowerCase());
            if (!creditAccount) {
                creditAccount = {
                    name: transferOriginal.creditAccount,
                    shares: transferOriginal.shares,
                    sharePrice: transferOriginal.sharePrice };
                data.assets.push(creditAccount);
            } else {
                creditAccount.shares = Currency(creditAccount.shares, Util.getCurrencyDefaults()).add(transferOriginal.shares).toString();
            }
            if (Currency(debitAccount.shares).intValue < 1) {
                data.assets = data.assets.filter(x => x.name.toLowerCase() !== debitAccount.name.toLowerCase());
            }
            patch.assets = data.assets;
        }
        try {
            await dataClient.patch(settings.s3ObjectKey, patch);
            window.location.reload();
        } catch (err) {
            Util.log(err);
        }
    }
    function setView(data) {
        if (!data.pending) {
            return;
        }
        let accounts = data.pending
            .filter(x => (x.type || '').toLowerCase() !== 'expense')
            .map(x => (x.creditAccount || '').toLowerCase())
            .concat(data.pending.map(x => (x.debitAccount || '').toLowerCase()));
        let uniqueAccounts = new Set(accounts);
        accounts = [...uniqueAccounts];
        for (let account of accounts) {
            let startingBalance = Currency(0, Util.getCurrencyDefaults());
            let settled = [];
            if (account.toLowerCase() === 'bonds') {
                settled = data.bonds || [];
            } else {
                settled = (data.assets || []).filter(x => x.name.toLowerCase() === account.toLowerCase())
                    .concat((data.cash || []).filter(x => x.name.toLowerCase() == account.toLowerCase()));
            }
            for (let settledTransaction of settled) {
                startingBalance = startingBalance.add(Util.getAmount(settledTransaction));
            }
            $('.accounts-container').append(AccountsView.getAccountView(account, data.pending, startingBalance.toString(),
                cancelTransfer,
                completeTransfer
            ));
        }
    }
    async function refresh() {
        try {
            let data = await dataClient.getData();
            setView(data);
            if (location.hash && document.querySelector(location.hash)) {
                window.scrollTo(0, document.querySelector(location.hash).offsetTop);
            }
        } catch (err) {
            Util.log(err);
        }
    }
    this.init = function (settingsIn) {
        settings = settingsIn;
        dataClient = new DataClient(settings);
        new AccountSettingsController().init(settings, balanceSheetView);
        if (settings.s3ObjectKey) {
            refresh();
        }
    };
}

module.exports = AccountsController;