const balanceSheetView = require('../views/balance-sheet/balance-sheet-view');
const DataClient = require('../data-client');
const AccountSettingsController = require('./account-settings-controller');
const Util = require('../util');
const moment = require('moment');
const Currency = require('currency.js');
function AccountsController() {
    'use strict';
    let dataClient;
    let settings;
    function cancelTransfer(transfer) {
        let dataClient = new DataClient(settings);
        dataClient.getData()
            .then(data => {
                data.pending = data.pending.filter(x => x.id != transfer.id);
                return dataClient.put(settings.s3ObjectKey, data);
            })
            .then(putResult => { window.location.reload(); })
            .catch(err => { Util.log(err); });
    }
    function completeTransfer(transfer) {
        let dataClient = new DataClient(settings);
        dataClient.getData()
            .then(data => {
                let transferOriginal = data.pending.find(x => x.id === transfer.id);
                data.pending = data.pending.filter(x => x.id !== transfer.id);
                if (transferOriginal.creditAccount.toLowerCase() !== 'bonds') {
                    throw 'unknown creditAccount for transfer ' + transferOriginal.creditAccount;
                }
                let debitAccount = data.assets.find(x => x.name.toLowerCase() === transferOriginal.debitAccount.toLowerCase());
                let debitAccountAmount = Currency(debitAccount.amount);
                debitAccount.amount = debitAccountAmount.subtract(transferOriginal.amount).toString();
                data.assets.sort((a, b) => b.amount - a.amount);
                delete transferOriginal.creditAccount;
                delete transferOriginal.debitAccount;
                delete transferOriginal.transferDate;
                if (!data.bonds) {
                    data.bonds = [];
                }
                data.bonds.push(transferOriginal);
                data.bonds.sort((a, b) =>
                    moment(a.issueDate).add(a.daysToMaturation, 'days').valueOf() -
                    moment(b.issueDate).add(b.daysToMaturation, 'days').valueOf());
                return dataClient.put(settings.s3ObjectKey, data);
            })
            .then(putResult => { window.location.reload(); })
            .catch(err => { Util.log(err); });
    }
    function getAccountView(account, pendingTransfers, isDebit) {
        let accountType = isDebit ? 'debit': 'credit';
        let accountContainer = $(`
                <div>
                    <h4 id="${accountType}-account-${account}" class="capitalize-first">${account}</h3>
                    <div class="row table-header-row">
                        <div class="col-xs-4">Transfer Date</div>
                        <div class="col-xs-3">${isDebit ? 'Credit' : 'Debit'} Account</div>
                        <div class="col-xs-3">Amount</div>
                        <div class="col-xs-1">Complete</div>
                        <div class="col-xs-1">Cancel</div>
                    </div>   
                </div>`);
        let total = Currency(0);
        for (let transferIndex = 0; transferIndex < pendingTransfers.length; transferIndex += 1) {
            let transfer = pendingTransfers[transferIndex];
            let transferAccountType = isDebit ? transfer.creditAccount : transfer.debitAccount;
            total = total.add(transfer.amount);
            let accountRow = $(`
                        <div class="row account-row">
                            <div class="col-xs-4 vertical-align amount-description-column">${moment(transfer.transferDate).format('YYYY-MM-DD UTC Z')}</div>
                            <div class="col-xs-3 vertical-align amount-description-column">${transferAccountType}</div>
                            <div class="col-xs-3 vertical-align amount-description-column text-right">${Util.format(transfer.amount)}</div>
                            <div class="col-xs-1 text-center">
                                <button type="button" class="complete-transfer btn btn-success add-remove-btn-container add-remove-btn" title="Complete transfer">
                                    <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                                </button>
                            </div>
                            <div class="col-xs-1 remove-button-container text-center">
                                <button type="button" class="cancel-transfer btn remove add-remove-btn-container add-remove-btn" title="Cancel transfer">
                                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>`);
            accountRow.find('.cancel-transfer').click(function () { cancelTransfer(transfer) });
            accountRow.find('.complete-transfer').click(function () { completeTransfer(transfer) });
            accountContainer.append(accountRow);
        }
        accountContainer.append(`
                    <div class="row">
                        <div class="col-xs-10 subtotal">Total<span class="pull-right">${Util.format(total.toString())}</span></div>
                    </div>`);
        return accountContainer;
    }
    function setView(data) {
        if (!data.pending) {
            return;
        }
        let creditAccounts = data.pending.map(x => (x.creditAccount || '').toLowerCase());
        creditAccounts = [...new Set(creditAccounts)];
        for (let index = 0; index < creditAccounts.length; index += 1) {
            let pendingTransfers = data.pending.filter(x => x.creditAccount.toLowerCase() === creditAccounts[index]);
            $('.credit-accounts-container').append(getAccountView(creditAccounts[index], pendingTransfers, false));
        }
        let debitAccounts = data.pending.map(x => (x.debitAccount || '').toLowerCase());
        debitAccounts = [...new Set(debitAccounts)];
        for (let index = 0; index < debitAccounts.length; index += 1) {
            let pendingTransfers = data.pending.filter(x => x.debitAccount.toLowerCase() === debitAccounts[index]);
            $('.debit-accounts-container').append(getAccountView(debitAccounts[index], pendingTransfers, true));
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