const Currency = require('currency.js');

function AssetViewModel() {

    let self = this;

    this.format = function(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    this.getTotal = function (name, amount) {
        'use strict';
        return $(`<div class="subtotal">Total ${name}<span class="pull-right">${this.format(amount)}</span></div>`);
    };

    this.getAssetTotal = function (assets) {
        let total = Currency(0);
        for (var i = 0; i < assets.length; i += 1) {
            total = total.add(assets[i].amount);
        }
        return total.toString();
    };

    this.getModels = function() {
        var models = [];
        $('.asset-item').each(function () {
            models.push(self.getModel(this));
        });
        models.sort((a, b) => b.amount - a.amount);
        return models;
    };

    this.getModel = function (target) {
        let model = {};
        model.amount = $(target).find('input.amount').val().trim();
        model.name = $(target).find('input.name').val().trim();
        return model;
    };

    this.getAllocation = function (total, subtotal) {
        let allocation = Currency(subtotal, {precision: 4}).divide(total).multiply(100).toString();
        return Currency(allocation, {precision: 2}).toString() + "%";
    };

    this.getBalanceView = function (amount, name, total) {
        'use strict';
        let allocation = Currency(amount, {precision: 4}).divide(total).multiply(100).toString();
        allocation = Currency(allocation, {precision: 2}).toString() + "%";
        var view = $(`<div class="asset-item row transaction-input-view">
                    <div class="col-xs-4">
                        <div class="input-group">
                            <div class="input-group-addon ">$</div>
                            <input class="amount form-control text-right" type="text" value="${amount}" />
                        </div>
                    </div>
                    <div class="col-xs-4"><input class="input-name name form-control" type="text" value="${name}" /></div>
                    <div class="col-xs-2 text-right vertical-align amount-description-column">${allocation.toString()}</div>
                  </div>
    `);
        var transferButton = $(`<div class="col-xs-1">
                            <button type="button" class="btn btn-success add-remove-btn-container add-remove-btn" title="Transfer Cash or Stock">
                                <span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>
                            </button>
                          </div>
    `);
        view.append(transferButton);
        var removeButton = $(`<div class="col-xs-1 remove-button-container">
                            <button type="button" class="btn remove add-remove-btn-container add-remove-btn" title="Remove Cash or Stock">
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </button>
                          </div>
    `);
        removeButton.click(function () {
            view.remove();
        });
        view.append(removeButton);
        let viewContainer = $('<div></div>');
        viewContainer.append(view);

        transferButton.find('button').click(function () {
            transferButton.find('button').attr("disabled", true);
            let transferView = $(`
            <form class="transferring">
                <div class="form-group row">
                  <label class="col-xs-3 col-form-label col-form-label-lg">Source</label>
                  <div class="col-xs-9">
                      <input disabled="disabled" class="transfer-source form-control text-right" type="text" value="${view.find('.input-name').val()}">
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-xs-3 col-form-label col-form-label-lg">Target</label>
                  <div class="col-xs-9">
                      <select class="asset-type-selector form-control">
                          <option>Select an Asset Type</option>
                          <option value="loan">Loan</option>
                          <option value="cash-or-stock">Cash or Stock</option>
                          <option value="bond">Bond</option>
                      </select>
                  </div>
                </div>
                <div class="target-asset-type">
                </div>
            </form>
            `);
            viewContainer.append(transferView);

            viewContainer.find('.asset-type-selector').change(function () {
                console.log(viewContainer.find('.asset-type-selector').val());
            });

            let saveTransferBtn = $(`<input type="button" value="Transfer" class="btn btn-primary">`);
            transferView.append(saveTransferBtn);
            let cancelTransferBtn = $(`<input type="button" value="Cancel" class="btn btn-default cancel">`);
            transferView.append(cancelTransferBtn);

            cancelTransferBtn.click(function () {
                transferButton.find('button').attr("disabled", false);
                transferView.remove();
            });
        });
        return viewContainer;
    };
}

module.exports = AssetViewModel;
