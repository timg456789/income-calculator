const LoanViewModel = require('./loan-view-model');
const CashViewModel = require('./cash-view-model');
const CashOrStockViewModel = require('./cash-or-stock-view-model');
const PpeVm = require('./property-plant-and-equipment-view-model');
const BondViewModel = require('./bond-view-model');
const cal = require('../../calculators/calendar');
const Currency = require('currency.js');
const Util = require('../../util');
exports.getModel = function () {
    return {
        balances: new LoanViewModel().getModels()
    };
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
    if (!budget.balances) {
        return '0';
    }
    $('#balance-input-group').empty();
    let total = Currency(0, Util.getCurrencyDefaults());
    for (let loan of budget.balances) {
        let monthlyTxn = budget.monthlyRecurringExpenses.find(x => x.name === loan.name);
        let weeklyTxn = budget.weeklyRecurringExpenses.find(x => x.name === loan.name);
        let weeklyAmount = monthlyTxn ? (monthlyTxn.amount/100) / cal.WEEKS_IN_MONTH
            : weeklyTxn ? weeklyTxn.amount/100 : 0;
        total = total.add(loan.amount);
        $('#balance-input-group').append(new LoanViewModel().getView(loan.amount, loan.name, loan.rate, weeklyAmount));
    }
    $('#loan-total-amount').append(
        $(`<div class="subtotal">Loans<span class="pull-right amount">${Util.format(total.toString())}</span></div>`)
    );
    return total.toString();
}

exports.setView = function (budget, totalCashAndStocks) {
    $('.assets-header-container').append(new CashOrStockViewModel().getReadOnlyHeaderView());
    $('.property-plant-and-equipment-header-container').append(new PpeVm().getHeaderView());
    let totalLoans = setBalances(budget);
    let totalCash = Currency(0, Util.getCurrencyDefaults());
    for (let cash of budget.cash || []) {
        totalCash = totalCash.add(cash.amount);
        $('#cash-input-group').append(new CashViewModel().getReadOnlyView(cash.amount, cash.name));
    }
    let totalPropertyPlantAndEquipment = Currency(0, Util.getCurrencyDefaults());
    for (let tangibleAsset of budget.propertyPlantAndEquipment || []) {
        totalPropertyPlantAndEquipment = totalPropertyPlantAndEquipment.add(tangibleAsset.amount);
        $('#property-plant-and-equipment-input-group').append(new PpeVm().getReadOnlyView(tangibleAsset.amount, tangibleAsset.name));
    }
    let ppeTotalView = $(`<div class="subtotal">Total Property, Plant and Equipment<span class="pull-right amount">${Util.format(totalPropertyPlantAndEquipment.toString())}</span></div>`);
    $('#property-plant-and-equipment-total-amount').append(ppeTotalView);
    for (let asset of budget.assets || []) {
        $('#asset-input-group').append(new CashOrStockViewModel().getReadOnlyView(
            asset.name, totalCashAndStocks.toString(), budget.pending,
            asset.shares, asset.sharePrice
        ));
    }
    let totalBonds = Currency(0, Util.getCurrencyDefaults());
    for (let bond of budget.bonds || []) {
        totalBonds = totalBonds.add(Currency(bond.amount));
        $('#bond-input-group').append(new BondViewModel().getReadOnlyView(bond));
    }
    let totalAssets = Currency(totalCashAndStocks, Util.getCurrencyDefaults())
        .add(totalBonds)
        .add(totalCash)
        .toString();
    $('#cash-allocation').append($(`<div class="allocation">Non-Tangible Allocation of Cash<span class="pull-right amount">
            ${new CashOrStockViewModel().getAllocation(totalAssets, totalCash).toString()}</span></div>`));
    $('#cash-total-amount').append(
        $(`<div class="subtotal">Total Cash<span class="pull-right amount">${Util.format(totalCash.toString())}</span></div>`)
    );
    $('#cash-and-stocks-allocation').append($(`<div class="allocation">Non-Tangible Allocation of Equities<span class="pull-right amount">
            ${new CashOrStockViewModel().getAllocation(totalAssets, totalCashAndStocks).toString()}</span></div>`));
    $('#cash-and-stocks-total-amount').append(
        $(`<div class="subtotal">Total Equities<span class="pull-right amount">${Util.format(totalCashAndStocks.toString())}</span></div>`)
    );
    $('#bond-allocation').append($(`<div class="allocation">Non-Tangible Allocation of Bonds<span class="pull-right amount">${new CashOrStockViewModel().getAllocation(totalAssets, totalBonds.toString()).toString()}</span></div>`));
    $('#bond-total-amount').append(
        (`<div class="subtotal">Total Bonds<span class="pull-right amount">${Util.format(totalBonds.toString())}</span></div>`)
    );
    $('#assets-total-amount').append($(`<div class="subtotal">Total Non-Tangible Assets<span class="pull-right amount">${Util.format(totalAssets)}</span></div>`));
    let net = Currency(0, Util.getCurrencyDefaults())
        .subtract(totalLoans)
        .add(totalPropertyPlantAndEquipment)
        .add(totalAssets);
    $('#net-total').text(Util.format(net.toString()));
    setupToggle('#tree-view-loans','#loans-container');
    setupToggle('#tree-view-cash', '#cash-container');
    setupToggle('#tree-view-property-pant-and-equipment', '#property-plant-and-equipment-container');
    setupToggle('#tree-view-cash-or-stock','#assets-container');
    setupToggle('#tree-view-bonds','#bond-container');
};