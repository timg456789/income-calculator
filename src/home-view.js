const cal = require('./calculators/calendar');
const CalendarCalculator = require('../src/calendar-calculator');
const calCalc = new CalendarCalculator();
const Currency = require('currency.js');

function getTxInputHtmlMonthly(date) {
    var txHtmlInput = '<select class="date form-control inline-group">';
    var txHtmlDayInput;
    var currentDayOfWeek;
    var isDaySelected = '';

    if (date) {
        date = new Date(date);
    } else {
        date = calCalc.createByMonth(new Date().getUTCFullYear(), new Date().getUTCMonth());
    }

    currentDayOfWeek = new Date(date.getTime());
    currentDayOfWeek.setUTCDate(1);

    for (var day = 1; day <= 28; day++) {
        txHtmlDayInput = ' value="' + currentDayOfWeek + '" ';

        if (currentDayOfWeek.getUTCDate() === date.getUTCDate()) {
            isDaySelected = 'selected="selected"';
        } else {
            isDaySelected = '';
        }

        txHtmlInput += '<option' + txHtmlDayInput + isDaySelected + '>' +
            day +
            '</option>';
        currentDayOfWeek.setUTCDate(currentDayOfWeek.getUTCDate() + 1);
    }

    txHtmlInput += '</select>';
    return txHtmlInput;
}

function getTxInputHtmlWeekly(date) {
    var txHtmlInput = '<select class="date form-control inline-group">';
    var txHtmlDayInput;
    var currentDayOfWeek;
    var isDaySelected = '';

    if (date) {
        date = new Date(date);
    } else {
        date = new Date();
        date = calCalc.getFirstDayInWeek(date);
    }

    currentDayOfWeek = calCalc.getFirstDayInWeek(date);

    for (var day = 0; day < 7; day++) {
        txHtmlDayInput = ' value="' + currentDayOfWeek + '" ';

        if (currentDayOfWeek.getUTCDay() === date.getUTCDay()) {
            isDaySelected = 'selected="selected"';
        } else {
            isDaySelected = '';
        }

        txHtmlInput += '<option' + txHtmlDayInput + isDaySelected + '>' +
            cal.DAY_NAMES[day] +
            '</option>';
        currentDayOfWeek.setUTCDate(currentDayOfWeek.getUTCDate() + 1);
    }

    txHtmlInput += '</select>';
    return txHtmlInput;
}

exports.getTransactionView = function (transaction, iteration) {
    let amount = '';
    if (transaction.amount) {
        amount = transaction.amount / 100;
    }
    let date = '';
    if (transaction.date) {
        date = transaction.date;
    }
    let name = '';
    if (transaction.name) {
        name = transaction.name;
    }
    let txHtmlInput = iteration === 'weekly'
        ? getTxInputHtmlWeekly(date)
        : getTxInputHtmlMonthly(date);
    let html = `
        <div class="row transaction-input-view ${iteration}-expense-item">
            <div class="col-xs-4">
                <div class="input-group">
                    <div class="input-group-addon ">$</div>
                    <input class="amount form-control" type="text" value="${amount}" />
                    <div class="input-group-addon">.00</div>
                </div>
            </div>
            <div class="col-xs-3">${txHtmlInput}</div>
            <div class="col-xs-4"><input class="name form-control" type="text" value="${name}" /></div>
        </div>`;
    let view = $(html);
    let removeButtonHtml = `
        <div class="col-xs-1 add-remove-btn-container">
            <button class="btn remove add-remove-btn-container add-remove-btn">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </button>
        </div>`;
    let removeButton = $(removeButtonHtml);
    removeButton.click(function () {
        view.remove();
    });
    view.append(removeButton);
    return view;
};

function getTransactionModel(target) {
    'use strict';
    var transaction = {};
    var amountInput = $(target).find('input.amount');
    var dateInput = $(target).find('.date.form-control');
    var nameInput = $(target).find('input.name');
    transaction.amount = parseFloat(amountInput.val().trim()) * 100;
    var rawDate = dateInput.val();
    var rawTrimmedDate = rawDate.trim();
    transaction.date = new Date(rawTrimmedDate);
    transaction.name = nameInput.val().trim();
    transaction.type = 'expense';
    return transaction;
}

function insertTransactionViews(transactions, target, iteration) {
    'use strict';
    $(target).empty();
    var i;
    for (i = 0; i < transactions.length; i += 1) {
        $(target).append(exports.getTransactionView(transactions[i], iteration));
    }
}

exports.setView = function (budget) {
    'use strict';
    $('#biweekly-input').val(budget.biWeeklyIncome.amount / 100);
    insertTransactionViews(budget.weeklyRecurringExpenses, '#weekly-input-group', 'weekly');
    insertTransactionViews(budget.monthlyRecurringExpenses, '#monthly-input-group', 'monthly');
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
    budgetSettings.monthlyRecurringExpenses.sort(function(a,b) {
        return b.amount - a.amount;
    });
    budgetSettings.weeklyRecurringExpenses = [];
    $('.weekly-expense-item').each(function () {
        budgetSettings.weeklyRecurringExpenses.push(getTransactionModel(this));
    });
    budgetSettings.weeklyRecurringExpenses.sort(function(a,b) {
        return b.amount - a.amount;
    });
    return budgetSettings;
};
