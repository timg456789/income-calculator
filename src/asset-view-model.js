const Currency = require('currency.js');

exports.getModels = function() {
    var assets = [];

    $('.asset-item').each(function () {
        assets.push(exports.getModel(this));
    });

    return assets;
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
    var view = $(`<div class="asset-item input-group transaction-input-view">
                    <div class="input-group-addon">$</div>
                    <input class="amount form-control inline-group" type="text" value="${amount}" />
                    <div class="input-group-addon">name</div>
                    <input class="name form-control inline-group" type="text" value="${name}" />
                    <div class="input-group-addon">allocation</div>
                    <input class="form-control inline-group" type="text" value="${allocation.toString()}" />`);
    var removeButton = $(`<div class="input-group-addon remove" title="Remove Cash or Stock">
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </div>`);
    removeButton.click(function () {
        view.remove();
    });
    view.append(removeButton);
    return view;
};
