const BalanceViewModel = require('../balance-view-model');
const AssetViewModel = require('../asset-view-model');
const BondViewModel = require('../bond-view-model');
const cal = require('income-calculator/src/calendar');
const Currency = require('currency.js');
exports.getModel = function () {
    var model = {};
    model.balances = BalanceViewModel.getModels();
    model.assets = new AssetViewModel().getModels();
    model.bonds = BondViewModel.getModels();
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
        balanceView = BalanceViewModel.getBalanceView(
            budget.balances[i].amount,
            budget.balances[i].name,
            budget.balances[i].rate,
            weeklyAmount
        );
        $(balanceTarget).append(balanceView);
    }
    $('#loan-total-amount').append(new AssetViewModel().getTotal('Loans', total));
}

exports.setView = function (budget) {
    if (budget.balances) {
        setBalances(budget);
    }
    let totalCashAndStocks = Currency(0).toString();
    if (budget.assets) {
        $('#asset-input-group').empty();
        totalCashAndStocks = new AssetViewModel().getAssetTotal(budget.assets);
        for (var i = 0; i < budget.assets.length; i += 1) {
            let asset = budget.assets[i];
            $('#asset-input-group').append(new AssetViewModel().getBalanceView(
                asset.amount, asset.name, totalCashAndStocks.toString()
            ));
        }
    }
    let totalBonds = Currency(0);
    if (budget.bonds) {
        $('#bonds-input-group').empty();
        for (var i = 0; i < budget.bonds.length; i += 1) {
            totalBonds = totalBonds.add(Currency(budget.bonds[i].amount));
            $('#bond-input-group').append(BondViewModel.getBondView(budget.bonds[i]));
        }
    }
    let totalAssets = Currency(totalCashAndStocks).add(totalBonds);
    $('#cash-and-stocks-allocation').append($(`<div class="allocation">Allocation of Cash &amp; Stocks<span class="pull-right">${new AssetViewModel().getAllocation(totalAssets, totalCashAndStocks).toString()}</span></div>`));
    $('#cash-and-stocks-total-amount').append(new AssetViewModel().getTotal('Cash &amp; Stocks', totalCashAndStocks.toString()));
    $('#bond-allocation').append($(`<div class="allocation">Allocation of Bonds<span class="pull-right">${new AssetViewModel().getAllocation(totalAssets, totalBonds).toString()}</span></div>`));
    $('#bond-total-amount').append(
        (`<div class="subtotal">Total Bonds<span class="pull-right">${new AssetViewModel().format(totalBonds.toString())}</span></div>`)
    );
    $('#assets-total-amount').append($(`<div class="total">Total Assets<span class="pull-right">${new AssetViewModel().format(totalAssets)}</span></div>`));
    setupToggle('#tree-view-loans','#balance-input-group');
    setupToggle('#tree-view-cash-or-stock','#asset-input-group');
    setupToggle('#tree-view-bonds','#bond-input-group');
};