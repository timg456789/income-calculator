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
        console.log(creditAccounts);
        for (let index = 0; index < creditAccounts.length; index += 1) {
            let transfersForCreditAccount = data.pending.filter(x => x.creditAccount.toLowerCase() === creditAccounts[index])
            console.log('transfers: ' + transfersForCreditAccount.length);
            let accountContainer = $(`
                <div>
                    <h3 class="capitalize-first">${creditAccounts[index]}</h3>
                    <div class="row table-header-row">
                        <div class="col-xs-4">Transfer Date</div>
                        <div class="col-xs-3">Debit Account</div>
                        <div class="col-xs-4">Amount</div>
                        <div class="col-xs-1">Realize</div>
                    </div>   
                </div>
            `);
            let total = Currency(0);
            for (let transferIndex = 0; transferIndex < transfersForCreditAccount.length; transferIndex += 1) {
                total = total.add(transfersForCreditAccount[transferIndex].amount);
                accountContainer.append($(`
                        <div class="row account-row">
                            <div class="col-xs-4">${moment(transfersForCreditAccount[transferIndex].transferDate).format('YYYY-MM-DD UTC Z')}</div>
                            <div class="col-xs-3">${transfersForCreditAccount[transferIndex].debitAccount}</div>
                            <div class="col-xs-4 text-right">${Util.format(transfersForCreditAccount[transferIndex].amount)}</div>
                            <div class="col-xs-1 text-center"><span class="glyphicon glyphicon-export"></span></div>
                        </div>
                `));
            }
            accountContainer.append(
                `
                    <div class="row">
                        <div class="col-xs-11 subtotal">Total<span class="pull-right">${Util.format(total.toString())}</span></div>
                    </div>
                `
            );
            $('.accounts-container').append(accountContainer);
        }
    }
    async function refresh() {
        try {
            let data = await dataClient.getData();
            setView(data);
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