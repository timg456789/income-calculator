const balanceSheetView = require('../views/balance-sheet-view');
const DataClient = require('../data-client');
const AccountSettingsController = require('./account-settings-controller');
const Util = require('../util');
const moment = require('moment');
const Currency = require('currency.js');
function AccountsController() {
    'use strict';
    let s3ObjKey;
    let dataClient;
    function setView(data) {
        if (!data.pending) {
            return;
        }
        let creditAccounts = data.pending.map(x => (x.creditAccount || '').toLowerCase());
        creditAccounts = [...new Set(creditAccounts)];
        for (let index = 0; index < creditAccounts.length; index += 1) {
            let accountContainer = $(`
                <div>
                    <h4 id="debit-account-${creditAccounts[index]}" class="capitalize-first">${creditAccounts[index]}</h3>
                    <div class="row table-header-row">
                        <div class="col-xs-4">Transfer Date</div>
                        <div class="col-xs-3">Debit Account</div>
                        <div class="col-xs-4">Amount</div>
                        <div class="col-xs-1">Realize</div>
                    </div>   
                </div>`);
            let total = Currency(0);
            let transfersForCreditAccount = data.pending.filter(x => x.creditAccount.toLowerCase() === creditAccounts[index]);
            for (let transferIndex = 0; transferIndex < transfersForCreditAccount.length; transferIndex += 1) {
                total = total.add(transfersForCreditAccount[transferIndex].amount);
                accountContainer.append($(`
                        <div class="row account-row">
                            <div class="col-xs-4">${moment(transfersForCreditAccount[transferIndex].transferDate).format('YYYY-MM-DD UTC Z')}</div>
                            <div class="col-xs-3">${transfersForCreditAccount[transferIndex].debitAccount}</div>
                            <div class="col-xs-4 text-right">${Util.format(transfersForCreditAccount[transferIndex].amount)}</div>
                            <div class="col-xs-1 text-center"><span class="glyphicon glyphicon-export"></span></div>
                        </div>`));
            }
            accountContainer.append(`
                    <div class="row">
                        <div class="col-xs-11 subtotal">Total<span class="pull-right">${Util.format(total.toString())}</span></div>
                    </div>`);
            $('.credit-accounts-container').append(accountContainer);
        }

        let debitAccounts = data.pending.map(x => (x.debitAccount || '').toLowerCase());
        debitAccounts = [...new Set(debitAccounts)];
        for (let debitAccountIndex = 0; debitAccountIndex < debitAccounts.length; debitAccountIndex += 1) {
            let debitAccountContainer = $(`
                <div>
                    <h4 id="debit-account-${debitAccounts[debitAccountIndex]}" class="capitalize-first">${debitAccounts[debitAccountIndex]}</h3>
                    <div class="row table-header-row">
                        <div class="col-xs-4">Transfer Date</div>
                        <div class="col-xs-3">Credit Account</div>
                        <div class="col-xs-4">Amount</div>
                        <div class="col-xs-1">Realize</div>
                    </div>   
                </div>
            `);
            let debitAccountTotal = Currency(0);
            let transfersForDebitAccount = data.pending.filter(x => x.debitAccount.toLowerCase() === debitAccounts[debitAccountIndex])
            for (let transferIndex = 0; transferIndex < transfersForDebitAccount.length; transferIndex += 1) {
                debitAccountTotal = debitAccountTotal.add(transfersForDebitAccount[transferIndex].amount);
                debitAccountContainer.append($(`
                        <div class="row account-row">
                            <div class="col-xs-4">${moment(transfersForDebitAccount[transferIndex].transferDate).format('YYYY-MM-DD UTC Z')}</div>
                            <div class="col-xs-3">${transfersForDebitAccount[transferIndex].creditAccount}</div>
                            <div class="col-xs-4 text-right">${Util.format(transfersForDebitAccount[transferIndex].amount)}</div>
                            <div class="col-xs-1 text-center"><span class="glyphicon glyphicon-export"></span></div>
                        </div>`));
            }
            debitAccountContainer.append(`
                    <div class="row">
                        <div class="col-xs-11 subtotal">Total<span class="pull-right">${Util.format(debitAccountTotal.toString())}</span></div>
                    </div>`);
            $('.debit-accounts-container').append(debitAccountContainer);
        }
    }
    async function refresh() {
        try {
            let data = await dataClient.getData();
            setView(data);


            if (location.hash) {
                window.scrollTo(0, document.querySelector(location.hash).offsetTop);
            }
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