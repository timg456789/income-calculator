const LoanViewModel = require('./loan-view-model');
const CashOrStockViewModel = require('./cash-or-stock-view-model');
const BondViewModel = require('./bond-view-model');
const cal = require('income-calculator/src/calendar');
const Currency = require('currency.js');
const Util = require('../../util');
exports.getModel = function () {
    var model = {};
    model.balances = new LoanViewModel().getModels();
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

function setBalances(budget) {
    $('#balance-input-group').empty();
    let balanceView;
    let total = 0;
    for (let loan of budget.balances) {
        let weeklyAmount;
        let monthlyTxn = budget.monthlyRecurringExpenses.find(x => x.name === loan.name);
        if (monthlyTxn) {
            weeklyAmount = (monthlyTxn.amount/100) / cal.WEEKS_IN_MONTH;
        } else {
            let weeklyTxn = budget.weeklyRecurringExpenses.find(x => x.name === loan.name);
            if (weeklyTxn) {
                weeklyAmount = weeklyTxn.amount/100;
            } else {
                weeklyAmount = 0;
            }
        }
        total += parseInt(loan.amount);
        balanceView = new LoanViewModel().getView(loan.amount, loan.name, loan.rate, weeklyAmount);
        $('#balance-input-group').append(balanceView);
    }
    $('#loan-total-amount').append(
        $(`<div class="subtotal">Loans<span class="pull-right amount">${Util.format(total.toString())}</span></div>`)
    );
}

exports.setView = function (budget, totalCashAndStocks) {
    $('.assets-header-container').append(new CashOrStockViewModel().getReadOnlyHeaderView());
    if (budget.balances) {
        setBalances(budget);
    }
    if (budget.assets) {
        $('#asset-input-group').empty();
        for (let asset of budget.assets) {
            $('#asset-input-group').append(new CashOrStockViewModel().getReadOnlyView(
                asset.name, totalCashAndStocks.toString(), budget.pending,
                asset.shares, asset.sharePrice
            ));
        }
    }
    let totalBonds = Currency(0);
    if (budget.bonds) {
        $('#bonds-input-group').empty();
        for (let bond of budget.bonds) {
            totalBonds = totalBonds.add(Currency(bond.amount));
            $('#bond-input-group').append(new BondViewModel().getReadOnlyView(bond));
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