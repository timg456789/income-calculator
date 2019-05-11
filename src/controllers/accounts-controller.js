const balanceSheetView = require('../views/balance-sheet/balance-sheet-view');
const DataClient = require('../data-client');
const AccountSettingsController = require('./account-settings-controller');
const Util = require('../util');
const moment = require('moment');
const Currency = require('currency.js');
const AvailableBalanceCalculator = require('../calculators/available-balance-calculator');
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
    function completeTransfer(transferId) {
        let dataClient = new DataClient(settings);
        dataClient.getData()
            .then(data => {
                let patch = {};
                let transferOriginal = data.pending.find(x => x.id === transferId);
                patch.pending = data.pending.filter(x => x.id !== transferId);
                let debitAccount = data.assets.find(x => x.name.toLowerCase() === transferOriginal.debitAccount.toLowerCase());
                let debitAccountAmount = Currency(debitAccount.amount);
                debitAccount.amount = debitAccountAmount.subtract(transferOriginal.amount).toString();
                if (transferOriginal.creditAccount.toLowerCase() === 'bonds') {
                    patch.bonds = data.bonds;
                    if (!patch.bonds) {
                        patch.bonds = [];
                    }
                    delete transferOriginal.creditAccount;
                    delete transferOriginal.debitAccount;
                    delete transferOriginal.transferDate;
                    patch.bonds.push(transferOriginal);
                } else {
                    let creditAccount = data.assets.find(x => x.name.toLowerCase() === transferOriginal.creditAccount.toLowerCase());
                    if (!creditAccount) {
                        data.assets.push({ name: transferOriginal.creditAccount, amount: transferOriginal.amount });
                    } else {
                        let creditAccountAmount = Currency(creditAccount.amount);
                        creditAccount.amount = creditAccountAmount.add(transferOriginal.amount).toString();
                    }
                }
                patch.assets = data.assets;
                return dataClient.patch(settings.s3ObjectKey, patch);
            })
            .then(putResult => { window.location.reload(); })
            .catch(err => { Util.log(err); });
    }
    function getJournalEntryView(viewModel) {
        let journalEntryView = $(`
                        <div class="row account-row">
                            <div class="col-xs-3 vertical-align amount-description-column">${viewModel.transferDate}</div>
                            <div class="col-xs-3 vertical-align amount-description-column">${viewModel.transferAccount}</div>
                            <div class="col-xs-2 vertical-align amount-description-column text-right">${viewModel.debitAmount}</div>
                            <div class="col-xs-2 vertical-align amount-description-column text-right">${viewModel.creditAmount}</div>
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
        if (viewModel.transferId) {
            journalEntryView.find('.cancel-transfer').click(function () { cancelTransfer(viewModel.transferId) });
            journalEntryView.find('.complete-transfer').click(function () { completeTransfer(viewModel.transferId) });
        }
        return journalEntryView;
    }
    function getAccountView(account, allPendingTransfers, startingBalance) {
        let pendingTransfers = allPendingTransfers.filter(x =>
            x.creditAccount.toLowerCase() === account.toLowerCase() ||
            x.debitAccount.toLowerCase() === account.toLowerCase());
        let accountContainer = $(`
                <div>
                    <h4 id="$account-${account}" class="capitalize-first">${account}</h3>
                    <div class="row table-header-row">
                        <div class="col-xs-3">Transfer Date</div>
                        <div class="col-xs-3">Account</div>
                        <div class="col-xs-2">Debit Amount</div>
                        <div class="col-xs-2">Credit Amount</div>
                        <div class="col-xs-1">Complete</div>
                        <div class="col-xs-1">Cancel</div>
                    </div>   
                </div>`);
        accountContainer.append(getJournalEntryView({
            transferDate: '',
            transferAccount: 'STARTING BALANCE',
            debitAmount: '',
            creditAmount: Util.format(startingBalance)
        }));
        for (let transfer of pendingTransfers) {
            let isCredit = transfer.creditAccount.toLowerCase() === account.toLowerCase();
            accountContainer.append(getJournalEntryView({
                transferDate: moment(transfer.transferDate).format('YYYY-MM-DD UTC Z'),
                transferAccount: isCredit ? transfer.debitAccount : transfer.creditAccount,
                debitAmount: isCredit ? '' : Util.format(transfer.amount),
                creditAmount: isCredit ? Util.format(transfer.amount) : '',
                transferId: transfer.id
            }));
        }
        let availableBalanceCalculator = new AvailableBalanceCalculator();
        let total = availableBalanceCalculator.getAvailableBalance(account, startingBalance, allPendingTransfers)
        accountContainer.append(`
                    <div class="row">
                        <div class="col-xs-10 subtotal">Total Future Balance<span class="pull-right">${Util.format(total.toString())}</span></div>
                    </div>`);
        return accountContainer;
    }
    function setView(data) {
        if (!data.pending) {
            return;
        }
        let accounts = data.pending.map(x => (x.creditAccount || '').toLowerCase())
            .concat(data.pending.map(x => (x.debitAccount || '').toLowerCase()));
        accounts = [...new Set(accounts)];
        for (let index = 0; index < accounts.length; index += 1) {
            let startingBalance = Currency(0);
            let settled = [];
            if (accounts[index].toLowerCase() === 'bonds') {
                settled = settled.concat(data.bonds || []);
            } else {
                settled = settled.concat((data.assets || []).filter(x => x.name.toLowerCase() === accounts[index].toLowerCase()));
            }
            for (let settledIndex = 0; settledIndex < settled.length; settledIndex += 1) {
                startingBalance = startingBalance.add(settled[settledIndex].amount);
            }
            $('.accounts-container').append(getAccountView(accounts[index], data.pending, startingBalance.toString()));
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