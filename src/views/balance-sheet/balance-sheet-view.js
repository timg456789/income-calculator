const LoanViewModel = require('./loan-view-model');
const CashOrStockViewModel = require('./cash-or-stock-view-model');
const BondViewModel = require('./bond-view-model');
const cal = require('income-calculator/src/calendar');
const Currency = require('currency.js/dist/currency.js');
const Util = require('../../util');
exports.getModel = function () {
    var model = {};
    model.balances = new LoanViewModel().getModels();
    model.assets = new CashOrStockViewModel().getModels();
    model.bonds = new BondViewModel().getModels();
    return model;
};

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
        balanceView = new LoanViewModel().getView(
            budget.balances[i].amount,
            budget.balances[i].name,
            budget.balances[i].rate,
            weeklyAmount
        );
        $(balanceTarget).append(balanceView);
    }
    $('#loan-total-amount').append(
        $(`<div class="subtotal">Loans<span class="pull-right amount">${Util.format(total.toString())}</span></div>`)
    );
}

exports.setView = function (budget) {
    if (budget.balances) {
        setBalances(budget);
    }
    let totalCashAndStocks = Currency(0).toString();
    if (budget.assets) {
        $('#asset-input-group').empty();
        totalCashAndStocks = new CashOrStockViewModel().getAssetTotal(budget.assets);
        for (var i = 0; i < budget.assets.length; i += 1) {
            let asset = budget.assets[i];
            $('#asset-input-group').append(new CashOrStockViewModel().getView(
                asset.amount, asset.name, totalCashAndStocks.toString(), budget.pending
            ));
        }
    }
    let totalBonds = Currency(0);
    if (budget.bonds) {
        $('#bonds-input-group').empty();
        for (var i = 0; i < budget.bonds.length; i += 1) {
            totalBonds = totalBonds.add(Currency(budget.bonds[i].amount));
            $('#bond-input-group').append(new BondViewModel().getReadOnlyView(budget.bonds[i]));
        }
    }
    let totalAssets = Currency(totalCashAndStocks).add(totalBonds).toString();
    $('#cash-and-stocks-allocation').append($(`<div class="allocation">Allocation of Cash &amp; Stocks<span class="pull-right amount">${new CashOrStockViewModel().getAllocation(totalAssets, totalCashAndStocks).toString()}</span></div>`));
    $('#cash-and-stocks-total-amount').append(
        $(`<div class="subtotal">Total Cash &amp; Stocks<span class="pull-right amount">${Util.format(totalCashAndStocks.toString())}</span></div>`)
    );
    $('#bond-allocation').append($(`<div class="allocation">Allocation of Bonds<span class="pull-right amount">${new CashOrStockViewModel().getAllocation(totalAssets, totalBonds.toString()).toString()}</span></div>`));
    $('#bond-total-amount').append(
        (`<div class="subtotal">Total Bonds<span class="pull-right amount">${Util.format(totalBonds.toString())}</span></div>`)
    );
    $('#assets-total-amount').append($(`<div class="total">Total Assets<span class="pull-right amount">${Util.format(totalAssets)}</span></div>`));
    setupToggle('#tree-view-loans','#balance-input-group');
    setupToggle('#tree-view-cash-or-stock','#asset-input-group');
    setupToggle('#tree-view-bonds','#bond-input-group');
};