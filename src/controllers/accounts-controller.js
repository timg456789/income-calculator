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
        let patch = {
            assets: data.assets || []
        };
        let transferOriginal = data.pending.find(x => x.id === transferId);
        patch.pending = data.pending.filter(x => x.id !== transferId);
        let debitAccount = patch.assets.find(x => x.id === transferOriginal.creditId ||
                                                (x.name || '').toLowerCase() === transferOriginal.debitAccount.toLowerCase());

        if (transferOriginal.type && transferOriginal.type.toLowerCase() === 'bond' ||
            transferOriginal.type && transferOriginal.type.toLowerCase() === 'expense') {

            debitAccount.amount = Currency(debitAccount.amount, Util.getCurrencyDefaults()).subtract(transferOriginal.amount).toString();

            if (transferOriginal.type.toLowerCase() !== 'expense') {
                delete transferOriginal.creditAccount;
                delete transferOriginal.debitAccount;
                delete transferOriginal.transferDate;
                patch.assets.push(transferOriginal);
            }

        } else if (transferOriginal.type && transferOriginal.type.toLowerCase() === 'cash') {
            let creditAmount = Util.getAmount(transferOriginal);
            debitAccount.amount = Currency(debitAccount.amount, Util.getCurrencyDefaults()).subtract(creditAmount).toString();
            let creditAccount = patch.assets.find(x =>
                (x.type || '').toLowerCase() === 'cash' &&
                x.name.toLowerCase() === transferOriginal.creditAccount.toLowerCase());
            if (!creditAccount) {
                patch.assets.push({
                    amount: transferOriginal.amount,
                    name: transferOriginal.name,
                    type: transferOriginal.type
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
            let creditAccount = patch.assets.find(x => x.name.toLowerCase() === transferOriginal.creditAccount.toLowerCase());
            if (!creditAccount) {
                creditAccount = {
                    name: transferOriginal.creditAccount,
                    shares: transferOriginal.shares,
                    sharePrice: transferOriginal.sharePrice
                };
                patch.assets.push(creditAccount);
            } else {
                creditAccount.shares = Currency(creditAccount.shares, Util.getCurrencyDefaults()).add(transferOriginal.shares).toString();
            }
            if (Currency(debitAccount.shares).intValue < 1) {
                patch.assets = patch.assets.filter(x => x.name.toLowerCase() !== debitAccount.name.toLowerCase());
            }
        }
        patch.assets = patch.assets.filter(x => Currency(Util.getAmount(x)).intValue > 0);
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
                settled = (data.assets || []).filter(x => (x.type || '').toLowerCase() == 'bond');
            } else {
                settled = (data.assets || []).filter(x => (x.name || '').toLowerCase() === account.toLowerCase());
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