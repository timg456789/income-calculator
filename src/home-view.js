const $ = require('jquery');

exports.getTransactionView = function (transaction, iteration, type) {
    'use strict';

    var amount = '';
    if (transaction.amount) {
        amount = transaction.amount / 100;
    }

    var date = '';
    if (transaction.date) {
        date = transaction.date;
    }

    var name = '';
    if (transaction.name) {
        name = transaction.name;
    }

    var html = '<div class="' + iteration + '-' + type + '-item input-group transaction-input-view">' +
            '<div class="input-group-addon">$</div>' +
            '<input class="amount form-control inline-group" type="text" value="' + amount + '" /> ' +
            '<div class="input-group-addon">&#64;</div>' +
            '<input class="date form-control inline-group" type="text" value="' + date + '" /> ' +
            '<input class="name form-control inline-group" type="text" value="' + name + '" /> ' +
            '</div>';

    var view = $(html);

    if (transaction.budget !== undefined) {
        var budgetInput = '<input class="budget form-control inline-group" ' +
                'type="text" value="' + transaction.budget + '" /> ';
        view.append(budgetInput);
    }

    var removeButtonHtml = '<div class="input-group-addon remove">' +
            '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
            '</div>';

    var removeButton = $(removeButtonHtml);

    removeButton.click(function () {
        view.remove();
    });

    view.append(removeButton);

    return view;
}

function getTransactionModel(target) {
    'use strict';

    var transaction = {};

    var amountInput = $(target).children('input.amount');
    var dateInput = $(target).children('input.date');
    var nameInput = $(target).children('input.name');

    transaction.amount = parseFloat(amountInput.val().trim()) * 100;
    transaction.date = new Date(dateInput.val().trim());
    transaction.name = nameInput.val().trim();
    transaction.type = 'expense';

    var budgetInput = $(target).children('input.budget');
    if (budgetInput && budgetInput.length > 0) {
        transaction.budget = budgetInput.val().trim();
    }

    return transaction;
}

function insertTransactionView(transaction, target, iteration, type) {
    'use strict';
    $(target).append(exports.getTransactionView(transaction, iteration, type));
}

function insertTransactionViews(transactions, target, iteration, type) {
    'use strict';
    $(target).empty();
    var i;
    for (i = 0; i < transactions.length; i += 1) {
        insertTransactionView(transactions[i], target, iteration, type);
    }
}

exports.setView = function (budget) {
    'use strict';
    $('#biweekly-input').val(budget.biWeeklyIncome.amount / 100);
    insertTransactionViews(budget.oneTime, '#one-time-input-group', 'one-time', 'expense');
    insertTransactionViews(budget.weeklyRecurringExpenses, '#weekly-input-group', 'weekly', 'expense');
    insertTransactionViews(budget.monthlyRecurringExpenses, '#monthly-input-group', 'monthly', 'expense');
    insertTransactionViews(budget.actual, '#actuals-input-group', 'actual', 'expense');
};

exports.getModel = function () {
    'use strict';

    var budgetSettings = {};

    budgetSettings.biWeeklyIncome = {};
    budgetSettings.biWeeklyIncome.amount = parseInt($('#biweekly-input').val().trim()) * 100;
    budgetSettings.biWeeklyIncome.date = new Date(Date.UTC(2015, 11, 25));

    budgetSettings.monthlyRecurringExpenses = [];
    $('.monthly-expense-item').each(function () {
        budgetSettings.monthlyRecurringExpenses.push(getTransactionModel(this));
    });

    budgetSettings.weeklyRecurringExpenses = [];
    $('.weekly-expense-item').each(function () {
        budgetSettings.weeklyRecurringExpenses.push(getTransactionModel(this));
    });

    budgetSettings.oneTime = [];
    $('.one-time-expense-item').each(function () {
        var ote = getTransactionModel(this);
        if (ote.amount > 0) {
            ote.type = 'income';
        } else {
            ote.amount = ote.amount * -1;
        }
        budgetSettings.oneTime.push(ote);
    });

    budgetSettings.actual = [];
    $('.actual-expense-item').each(function () {
        budgetSettings.actual.push(getTransactionModel(this));
    });

    return budgetSettings;
};
