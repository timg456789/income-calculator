
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

exports.getTotal = function (amount) {
    'use strict';
    return $(`<div class="input-group transaction-input-view">
                    <div class="input-group-addon">Total $</div>
                    <input class="amount form-control inline-group" type="text" value="${amount}" />
               </div>`);
};

exports.getBalanceView = function (amount, name) {
    'use strict';

    var html = '<div class="asset-item input-group transaction-input-view">' +
        '<div class="input-group-addon">$</div>' +
        '<input class="amount form-control inline-group" type="text" value="' + amount + '" />';
    html += '<div class="input-group-addon">name</div>';
    html += '<input class="name form-control inline-group" type="text" value="' + name + '" />';
    var view = $(html);

    var removeButtonHtml = '<div class="input-group-addon remove">' +
        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
        '</div>';

    var removeButton = $(removeButtonHtml);

    removeButton.click(function () {
        view.remove();
    });

    view.append(removeButton);

    return view;
};
