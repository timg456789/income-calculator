const Currency = require('currency.js');

exports.getModels = function() {
    var models = [];
    $('.asset-item').each(function () {
        models.push(exports.getModel(this));
    });
    models.sort((a, b) => b.amount - a.amount);
    return models;
};

exports.getAssetTotal = function (assets) {
    let total = Currency(0);
    for (var i = 0; i < assets.length; i += 1) {
        total = total.add(assets[i].amount);
    }
    return total.toString();
};

exports.getModel = function (target) {
    'use strict';
    var balance = {};
    var amountInput = $(target).children('input.amount');
    var nameInput = $(target).children('input.name');
    balance.amount = amountInput.val().trim();
    balance.name = nameInput.val().trim();
    return balance;
};

exports.getAllocation = function (total, subtotal) {
    let allocation = Currency(subtotal, {precision: 4}).divide(total).multiply(100).toString();
    return Currency(allocation, {precision: 2}).toString() + "%";
};

exports.format = function(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

exports.getTotal = function (name, amount) {
    'use strict';
    return $(`<div class="subtotal">Total ${name}<span class="pull-right">${this.format(amount)}</span></div>`);
};

exports.getBalanceView = function (amount, name, total) {
    'use strict';
    let allocation = Currency(amount, {precision: 4}).divide(total).multiply(100).toString();
    allocation = Currency(allocation, {precision: 2}).toString() + "%";
    var view = $(`<div class="asset-item row transaction-input-view">
                    <div class="col-xs-4">
                        <div class="input-group">
                            <div class="input-group-addon ">$</div>
                            <input class="amount form-control text-right" type="text" value="${amount}" />
                            <div class="input-group-addon">.00</div>
                        </div>
                    </div>
                    <div class="col-xs-4"><input class="name form-control" type="text" value="${name}" /></div>
                    <div class="col-xs-3 text-right vertical-align amount-description-column">${allocation.toString()}</div>
    `);
    var removeButton = $(`<div class="col-xs-1 remove-button-container">
                            <button class="btn remove add-remove-btn-container add-remove-btn" title="Remove Cash or Stock">
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </button>
                          </div>
    `);
    removeButton.click(function () {
        view.remove();
    });
    view.append(removeButton);
    return view;
};
