const moment = require('moment');

exports.getModels = function() {
    var models = [];

    $('.bond-item').each(function () {
        models.push(exports.getModel(this));
    });

    models.sort((a, b) =>
        moment(a.issueDate).add(a.daysToMaturation, 'days').valueOf() -
         moment(b.issueDate).add(b.daysToMaturation, 'days').valueOf());

    return models;
};

exports.getModel = function (target) {
    return {
        amount: $(target).children('input.amount').val().trim(),
        issueDate: moment($(target).children('input.issue-date').val().trim(), 'YYYY-MM-DD UTC Z'),
        daysToMaturation: $(target).children('select.type').val().trim()
    };
};

exports.getBondView = function (model) {
    'use strict';

    let issueDateText = moment(model.issueDate).format('YYYY-MM-DD UTC Z');
    let maturityDateText = moment(model.issueDate).add(model.daysToMaturation, 'days').format('YYYY-MM-DD UTC Z');

    var view = $(`<div class="bond-item input-group transaction-input-view">
                    <div class="input-group-addon">Face Value $</div>
                    <input class="amount form-control inline-group" type="text" value="${model.amount}" />
                    
                    <div class="input-group-addon">issue date</div>
                    <input class="issue-date form-control inline-group" type="text" value="${issueDateText}" />
                    
                    <div class="input-group-addon">type</div>
                    <select class="type form-control inline-group">
                        <option value="28" ${model.daysToMaturation == 28 ? 'selected="selected"' : ''}>4 Weeks</option>
                        <option value="56" ${model.daysToMaturation == 56 ? 'selected="selected"' : ''}">8 Weeks</option>
                    </select>
                    
                    <div class="input-group-addon">maturity date: ${maturityDateText}</div>
    `);

    var removeButton = $(`<div class="input-group-addon remove" title="Remove Bond">
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </div>`);

    removeButton.click(function () {
        view.remove();
    });

    view.append(removeButton);

    return view;
};
