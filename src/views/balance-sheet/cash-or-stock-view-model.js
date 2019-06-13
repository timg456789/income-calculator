const AvailableBalanceCalculator = require('../../calculators/available-balance-calculator');
const BondViewModel = require('./bond-view-model');
const Currency = require('currency.js');
const DataClient = require('../../data-client');
const LoanViewModel = require('./loan-view-model');
const moment = require('moment/moment');
const Util = require('../../util');
function CashOrStockViewModel() {
    let self = this;
    this.getViewType = function() {
        return 'cash-or-stock';
    };
    this.getTotal = function (name, amount) {
        'use strict';
        return $(`<div class="subtotal">Total ${name}<span class="pull-right">${Util.format(amount)}</span></div>`);
    };
    this.getAssetTotal = function (assets) {
        let total = Currency(0, { precision: 3 });
        for (let asset of assets) {
            total = total.add(Util.getAmount(asset));
        }
        return total.toString();
    };
    this.getModel = function (target) {
        let model = {};
        model.shares = $(target).find('input.shares').val().trim();
        model.sharePrice = $(target).find('input.share-price').val().trim();
        model.name = $(target).find('input.name').val().trim();
        return model;
    };
    this.getAllocation = function (total, subtotal) {
        let allocation = Currency(subtotal, {precision: 4}).divide(total).multiply(100).toString();
        return Currency(allocation, {precision: 2}).toString() + "%";
    };
    this.getReadOnlyHeaderView = function () {
        return $(`<div class="row table-header-row">
              <div class="col-xs-1">Shares</div>
              <div class="col-xs-1">Share Price</div>
              <div class="col-xs-2">Current Value</div>
              <div class="col-xs-2">Available Balance</div>
              <div class="col-xs-2">Name</div>
              <div class="col-xs-1">Chart</div>
              <div class="col-xs-2">Allocation</div>
              <div class="col-xs-1">Transfer</div>
          </div>`);
    };
    this.getReadOnlyView = function (name, total, pending, shares, sharePrice) {
        'use strict';
        let amount = Util.getAmount({"sharePrice": sharePrice, "shares": shares});
        name = name || '';
        let allocation = this.getAllocation(total, amount);
        let accountUrl = `${Util.rootUrl()}/pages/accounts.html${window.location.search}#debit-account-${name.toLowerCase()}`;
        let availableBalanceCalculator = new AvailableBalanceCalculator();
        let availableBalance = availableBalanceCalculator.getAvailableBalance(name, amount.toString(), pending);
        let availableBalanceView = availableBalance === amount.toString()
            ? Util.format(amount.toString())
            : `<a href="${accountUrl}">${Util.format(availableBalance)}</a>`;
        let view = $(`<div class="asset-item row transaction-input-view">
                    <div class="col-xs-1 text-right vertical-align amount-description-column">${shares}</div>
                    <div class="col-xs-1 text-right vertical-align amount-description-column">${Util.format(sharePrice)}</div>
                    <div class="col-xs-2 text-right vertical-align amount-description-column">${Util.format(amount)}</div>
                    <div class="col-xs-2 text-right vertical-align amount-description-column">${availableBalanceView}</div>
                    <div class="col-xs-2 vertical-align amount-description-column asset-name">${name}</div>
                    <div class="col-xs-1">
                        <button type="button" class="view-chart btn btn-success add-remove-btn" title="View chart">
                            <span class="glyphicon glyphicon-stats" aria-hidden="true"></span>
                        </button>
                    </div>
                    <div class="col-xs-2 text-right vertical-align amount-description-column">${allocation.toString()}</div>
                  </div>
        `);
        let transferButton = $(`<div class="col-xs-1">
                            <button type="button" class="btn btn-success add-remove-btn" title="Transfer Cash or Stock">
                                <span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>
                            </button>
                          </div>
        `);
        view.append(transferButton);
        view.find('.view-chart').click(function () {
            window.open(`https://finance.yahoo.com/quote/${name}`, '_blank');
        });
        let viewContainer = $('<div></div>');
        viewContainer.append(view);
        let defaultTransactionDate = moment().add(1, 'days').format('YYYY-MM-DD UTC Z');
        transferButton.find('button').click(function () {
            transferButton.find('button').attr("disabled", true);
            let transferView = $(`
            <form class="transferring">
                <div class="form-group row">
                  <label class="col-xs-3 col-form-label col-form-label-lg">Source</label>
                  <div class="col-xs-9">
                      <input disabled="disabled" class="transfer-source form-control text-right" type="text" value="${name}">
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-xs-3 col-form-label col-form-label-lg">Transfer Date</label>
                  <div class="col-xs-9">
                      <input class="transfer-date form-control text-right" type="text" value="${defaultTransactionDate}">
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-xs-3 col-form-label col-form-label-lg">Target</label>
                  <div class="col-xs-9">
                      <select class="asset-type-selector form-control">
                          <option>Select an Asset Type</option>
                          <option value="bond">Bond</option>
                          <option value="cash-or-stock">Cash or Stock</option>
                      </select>
                  </div>
                </div>
                <div class="target-asset-type">
                </div>
            </form>`);
            viewContainer.append(transferView);
            let viewModel;
            let newView;
            viewContainer.find('.asset-type-selector').change(function () {
                let selectedAssetType = viewContainer.find('.asset-type-selector').val();
                let viewTypes = [ new CashOrStockViewModel(), new BondViewModel() ];
                viewModel = viewTypes.find(x => x.getViewType().toLowerCase() === selectedAssetType.toLowerCase());
                transferView.find('.target-asset-type').empty();
                newView = viewModel.getView();
                transferView.find('.target-asset-type').append(viewModel.getHeaderView());
                transferView.find('.target-asset-type').append(newView);
            });
            let saveTransferBtn = $(`<input type="button" value="Transfer" class="btn btn-primary">`);
            transferView.append(saveTransferBtn);
            let cancelTransferBtn = $(`<input type="button" value="Cancel" class="btn btn-default cancel">`);
            transferView.append(cancelTransferBtn);
            saveTransferBtn.click(function () {
                let dataClient = new DataClient(Util.settings());
                dataClient.getData()
                    .then(data => {
                        let patch = {};
                        if (!data.pending) {
                            data.pending = [];
                        }
                        if (!data.assets) {
                            data.assets = [];
                        }
                        patch.pending = data.pending;
                        let transferModel = viewModel.getModel(newView);
                        transferModel.id = Util.guid();
                        transferModel.transferDate = moment(transferView.find('.transfer-date').val().trim(), 'YYYY-MM-DD UTC Z');
                        transferModel.debitAccount = name;
                        if (viewModel.getViewType().toLowerCase() === 'cash-or-stock') {
                            let existingAccount = data.assets.find(x => x.name.toLowerCase() === transferModel.name.toLowerCase());
                            if (!existingAccount) {
                                existingAccount = {
                                    name: transferModel.name,
                                    amount: 0
                                };
                            }
                            transferModel.creditAccount = existingAccount.name;
                        }
                        patch.pending.push(transferModel);
                        return dataClient.patch(Util.settings().s3ObjectKey, patch);
                    })
                    .then(putResult => {
                        window.location.reload();
                    })
                    .catch(err => {
                        Util.log(err);
                    });
            });
            cancelTransferBtn.click(function () {
                transferButton.find('button').attr("disabled", false);
                transferView.remove();
            });
        });
        return viewContainer;
    };

    this.getHeaderView = function () {
        return $(`<div class="row table-header-row">
              <div class="col-xs-4">Shares</div>
              <div class="col-xs-4">Share Price</div>
              <div class="col-xs-4">Name</div>
          </div>`);
    };
    this.getView = function (name, total, pending, shares, sharePrice) {
        'use strict';
        let view = $(`<div class="asset-item row transaction-input-view">
                    <div class="col-xs-4">
                        <input class="shares form-control text-right" type="text" value="${shares || 0}" />
                    </div>
                    <div class="col-xs-4">
                        <div class="input-group">
                            <div class="input-group-addon ">$</div>
                            <input class="share-price form-control text-right" type="text" value="${sharePrice || '0.00'}" />
                        </div>
                    </div>
                    <div class="col-xs-4"><input class="input-name name form-control" type="text" value="${name || ''}" /></div>
                  </div>
        `);
        let viewContainer = $('<div></div>');
        viewContainer.append(view);
        return viewContainer;
    };
}

module.exports = CashOrStockViewModel;
