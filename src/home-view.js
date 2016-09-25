const $ = require('jquery');

function getJson(object) {
    return JSON.stringify(object, 0, 4);
}

function insertTransactionView(transaction) {
    return $('#monthly-input-group').append('<div class="monthly-expense-item input-group">' +
        '<div class="input-group-addon">$</div>' +
        '<input class="amount form-control inline-group" type="text" value="' + transaction.amount/100 + '" /> ' +
        '<div class="input-group-addon">&#64;</div>' +
        '<input class="date form-control inline-group" type="text" value="' + transaction.date + '" /> ' +
        '<input class="name form-control inline-group" type="text" value="' + transaction.name + '" /> ' +
        '</div>');
}

function insertTransactionViews(transactions) {
    for (var i = 0; i < transactions.length; i++) {
        insertTransactionView(transactions[i]);
    }
}

exports.setBudget = function (budget) {
        $('#one-time-input').val(getJson(budget.oneTimeExpenses));
        $('#biweekly-input').val(budget.biWeeklyIncome.amount/100);
        $('#weekly-input').val(getJson(budget.weeklyRecurringExpenses));
        $('#monthly-input').val(getJson(budget.monthlyRecurringExpenses));
        insertTransactionViews(budget.monthlyRecurringExpenses);
        $('#actuals').val(getJson(budget.actual));
    }
