const $ = require('jquery');

function getTransactionView(transaction, iteration, type) {
    var html = '<div class="' + iteration + '-' + type + '-item input-group transaction-input-view">' +
        '<div class="input-group-addon">$</div>' +
        '<input class="amount form-control inline-group" type="text" value="' + transaction.amount/100 + '" /> ' +
        '<div class="input-group-addon">&#64;</div>' +
        '<input class="date form-control inline-group" type="text" value="' + transaction.date + '" /> ' +
        '<input class="name form-control inline-group" type="text" value="' + transaction.name + '" /> ' +
        '</div>';

    var view = $(html);

    if (transaction.budget !== undefined) {
        view.append('<input class="budget form-control inline-group" ' +
            'type="text" value="' + transaction.budget + '" /> ');
    }

    return view;
}

function getTransactionModel(target) {
    var transaction = {};

    var amountInput = $(target).children('input.amount');
    var dateInput = $(target).children('input.date');
    var nameInput = $(target).children('input.name');

    transaction.amount = parseInt(amountInput.val().trim()) * 100;
    transaction.date = new Date(dateInput.val().trim());
    transaction.name = nameInput.val().trim();
    transaction.type = 'expense';

    var budgetInput = $(target).children('input.budget');
    if (budgetInput && budgetInput.length > 0) {
        transaction.budget = budgetInput.val().trim();
    }

    return transaction;
};

function insertTransactionView(transaction, target, iteration, type) {
    $(target).append(getTransactionView(transaction, iteration, type));
}

function insertTransactionViews(transactions, target, iteration, type) {
    for (var i = 0; i < transactions.length; i++) {
        insertTransactionView(transactions[i], target, iteration, type);
    }
}

exports.setView = function (budget) {
    $('#biweekly-input').val(budget.biWeeklyIncome.amount/100);
    insertTransactionViews(budget.oneTimeExpenses, '#one-time-input-group', 'one-time', 'expense');
    insertTransactionViews(budget.weeklyRecurringExpenses, '#weekly-input-group', 'weekly', 'expense');
    insertTransactionViews(budget.monthlyRecurringExpenses, '#monthly-input-group', 'monthly', 'expense');
    insertTransactionViews(budget.actual, '#actuals-input-group', 'actual', 'expense');
};

exports.getModel = function() {
    var budgetSettings = {};

    budgetSettings.biWeeklyIncome = {};
    budgetSettings.biWeeklyIncome.amount = parseInt($('#biweekly-input').val().trim()) * 100;

    budgetSettings.monthlyRecurringExpenses = [];
    $('.monthly-expense-item').each(function() {
        budgetSettings.monthlyRecurringExpenses.push(getTransactionModel(this));
    });

    budgetSettings.weeklyRecurringExpenses = [];
    $('.weekly-expense-item').each(function () {
        budgetSettings.weeklyRecurringExpenses.push(getTransactionModel(this));
    });

    budgetSettings.oneTimeExpenses = [];
    $('.one-time-expense-item').each(function() {
        budgetSettings.oneTimeExpenses.push(getTransactionModel(this));
    });

    budgetSettings.actuals = [];
    $('.actual-expense-item').each(function() {
        budgetSettings.actuals.push(getTransactionModel(this));
    });

    return budgetSettings;
}

