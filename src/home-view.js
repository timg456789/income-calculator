const cal = require('income-calculator/src/calendar');
const CalendarCalculator = require('../src/calendar-calculator');
const calCalc = new CalendarCalculator();
const BalanceViewModel = require('./balance-view-model');
const AssetViewModel = require('./asset-view-model');
const BondViewModel = require('./bond-view-model');
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

function getTransactionByName (txns, name) {
    for (var i = 0; i < txns.length; i++) {
        if (txns[i].name === name) {
            return txns[i];
        }
    }

    return null;
}

function setBalances(budget) {
    var balanceTarget = '#balance-input-group';
    $(balanceTarget).empty();
    var i;
    var balanceView;
    let total = 0;
    for (i = 0; i < budget.balances.length; i += 1) {
        var weeklyAmount;
        var monthlyTxn = getTransactionByName(budget.monthlyRecurringExpenses, budget.balances[i].name);
        if (monthlyTxn) {
            weeklyAmount = (monthlyTxn.amount/100) / cal.WEEKS_IN_MONTH;
        } else {
            var weeklyTxn = getTransactionByName(budget.weeklyRecurringExpenses, budget.balances[i].name);
            if (weeklyTxn) {
                weeklyAmount = weeklyTxn.amount/100;
            } else {
                weeklyAmount = 0;
            }
        }
        total += parseInt(budget.balances[i].amount);
        balanceView = BalanceViewModel.getBalanceView(
            budget.balances[i].amount,
            budget.balances[i].name,
            budget.balances[i].rate,
            weeklyAmount
        );
        $(balanceTarget).append(balanceView);
    }
    $('#loan-total-amount').append(AssetViewModel.getTotal('Loans', total));
}

function setupToggle(container, detail) {
    $(container).click(function () {
        $(container).empty();
        if ($(detail).is(':visible')) {
            $(detail).hide();
            $(container).append($('<span class="glyphicon glyphicon-expand" aria-hidden="true"></span>'));
        } else {
            $(detail).show();
            $(container).append($('<span class="glyphicon glyphicon-collapse-down" aria-hidden="true"></span>'));
        }
    });
}

exports.setView = function (budget) {
    'use strict';

    if (budget.balances) {
        setBalances(budget);
    }

    let totalCashAndStocks = Currency(0).toString();
    if (budget.assets) {
        $('#asset-input-group').empty();
        totalCashAndStocks = AssetViewModel.getAssetTotal(budget.assets);
        for (var i = 0; i < budget.assets.length; i += 1) {
            let asset = budget.assets[i];
            $('#asset-input-group').append(AssetViewModel.getBalanceView(
                asset.amount, asset.name, totalCashAndStocks.toString()
            ));
        }
    }
    let totalBonds = 0;
    if (budget.bonds) {
        $('#bonds-input-group').empty();
        for (var i = 0; i < budget.bonds.length; i += 1) {
            totalBonds += parseInt(budget.bonds[i].amount);
            $('#bond-input-group').append(BondViewModel.getBondView(budget.bonds[i]));
        }
    }
    let totalAssets = Currency(totalCashAndStocks).add(totalBonds);
    $('#cash-and-stocks-allocation').append($(`<div class="allocation">Allocation of Cash &amp; Stocks<span class="pull-right">${AssetViewModel.getAllocation(totalAssets, totalCashAndStocks).toString()}</span></div>`));
    $('#cash-and-stocks-total-amount').append(AssetViewModel.getTotal('Cash &amp; Stocks', totalCashAndStocks.toString()));
    $('#bond-allocation').append($(`<div class="allocation">Allocation of Bonds<span class="pull-right">${AssetViewModel.getAllocation(totalAssets, totalBonds).toString()}</span></div>`));
    $('#bond-total-amount').append(AssetViewModel.getTotal('Bonds', totalBonds));
    $('#assets-total-amount').append($(`<div class="total">Total Assets<span class="pull-right">${AssetViewModel.format(totalAssets)}</span></div>`));
    $('#biweekly-input').val(budget.biWeeklyIncome.amount / 100);
    insertTransactionViews(budget.weeklyRecurringExpenses, '#weekly-input-group', 'weekly');
    insertTransactionViews(budget.monthlyRecurringExpenses, '#monthly-input-group', 'monthly');
    setupToggle('#tree-view-loans','#balance-input-group');
    setupToggle('#tree-view-cash-or-stock','#asset-input-group');
    setupToggle('#tree-view-bonds','#bond-input-group');
};

exports.getBalanceSheetModel = function () {
    var model = {};
    model.balances = BalanceViewModel.getModels();
    model.assets = AssetViewModel.getModels();
    model.bonds = BondViewModel.getModels();
    return model;
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
