const cal = require('./calculators/calendar');
const CalendarCalculator = require('../src/calendar-calculator');
const calCalc = new CalendarCalculator();
function getTxInputHtmlMonthly() {
    let txHtmlInput = '<select class="date form-control"><option>Day of Month</option>';
    for (let day = 1; day <= cal.SAFE_LAST_DAY_OF_MONTH; day++) {
        txHtmlInput += `<option
            value=${new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), day)).toISOString()}>${day}</option>`;
    }
    txHtmlInput += '</select>';
    return txHtmlInput;
}
function getTxInputHtmlWeekly() {
    let txtHtmlInput = '<select class="date form-control"><option>Day of Week</option>';
    for (let day = 0; day < 7; day++) {
        txtHtmlInput += `<option value="${getDateWithDay(day)}">${cal.DAY_NAMES[day]}</option>`;
    }
    txtHtmlInput += '</select>';
    return txtHtmlInput;
}
function getDateWithDay(day) {
    let date = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
    let distance = day - date.getUTCDay();
    date.setDate(date.getDate() + distance);
    return date.toISOString();
}
function getTransactionModel(target) {
    return {
        amount: parseFloat($(target).find('.amount').val().trim()) * 100,
        date: $(target).find('.date').val().trim() || $(target).find('.date').data().date,
        name: $(target).find('.name').val().trim() || $(target).find('.name').text().trim(),
        type: $(target).find('.transaction-type').val() || $(target).data().txntype
    };
}
exports.getEditableTransactionView = function (iteration) {
    return `<h4>New ${iteration.charAt(0).toUpperCase()}${iteration.slice(1)} Transaction</h4>
                <form class="transferring container-fluid ${iteration}-expense-item new-transaction-view">
                <div class="form-group row">
                    <div class="col-xs-6"><input placeholder="Amount" class="amount form-control text-right" type="text" /></div>
                </div>
                <div class="form-group row">
                    <div class="col-xs-12">
                        ${iteration === 'weekly' ? getTxInputHtmlWeekly() : getTxInputHtmlMonthly()}
                    </div>
                </div>
                <div class="form-group row">
                  <div class="col-xs-12"><input placeholder="Name" class="name form-control" type="text" /></div>
                </div>
                <div class="form-group row">
                  <div class="col-xs-12">
                  <select class="transaction-type form-control">
                    <option>Transaction Type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  </div>
                </div>
            </form>`;
};
exports.getTransactionView = function (transaction, iteration) {
    let date = transaction.date || '';
    transaction.type = transaction.type || 'expense';
    let view = $(`
        <div class="row transaction-input-view ${iteration}-${transaction.type}-item" data-txntype="${transaction.type}">
            <div class="col-xs-4">
                <div class="input-group">
                    <div class="input-group-addon ">$</div>
                    <input class="amount form-control" type="text" value="${transaction.amount ? transaction.amount / 100 : ''}" />
                    <div class="input-group-addon">.00</div>
                </div>
            </div>
            <div class="col-xs-3"><span class="date" data-date="${date}">${iteration === 'weekly'
                ? cal.DAY_NAMES[new Date(date).getUTCDay()]
                : new Date(date).getUTCDate()}</span></div>
            <div class="col-xs-4 name">${transaction.name || ''}</div>
            <div class="col-xs-1 add-remove-btn-container">
                <button class="btn remove row-remove-button add-remove-btn-container add-remove-btn">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
            </div>
        </div>`);
    view.find('.row-remove-button').click(function () { view.remove(); });
    return view;
};
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
    let budgetSettings = {};
    budgetSettings.biWeeklyIncome = {};
    budgetSettings.biWeeklyIncome.amount = parseInt($('#biweekly-input').val().trim()) * 100;
    budgetSettings.biWeeklyIncome.date = new Date(Date.UTC(2015, 11, 25));
    budgetSettings.monthlyRecurringExpenses = [];
    $('.monthly-expense-item, .monthly-income-item').each(function () {
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
