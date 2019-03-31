const moment = require('moment');

exports.getModels = function() {
    var models = [];

    $('.bond-item').each(function () {
        models.push(exports.getModel(this));
    });

    return models;
};

exports.getModel = function (target) {
    'use strict';

    var balance = {};

    balance.amount = $(target).children('input.amount').val().trim();
    balance.name = $(target).children('input.name').val().trim();
    var dateText = $(target).children('input.maturity-date').val().trim();
    balance.maturityDate = moment(dateText, 'YYYY-MM-DD UTC Z');

    return balance;
};

exports.getBondView = function (amount, name, maturityDate) {
    'use strict';

    let dateText = moment(maturityDate).format('YYYY-MM-DD UTC Z');

    var view = $(`<div class="bond-item input-group transaction-input-view">
                    <div class="input-group-addon">Face Value $</div>
                    <input class="amount form-control inline-group" type="text" value="${amount}" />
                    <div class="input-group-addon">maturity date</div>
                    <input class="maturity-date form-control inline-group" type="text" value="${dateText}" />
                    <div class="input-group-addon">name</div>
                    <input class="name form-control inline-group" type="text" value="${name}" />`);

    var removeButton = $(`<div class="input-group-addon remove">
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </div>`);

    removeButton.click(function () {
        view.remove();
    });

    view.append(removeButton);

    return view;
};
