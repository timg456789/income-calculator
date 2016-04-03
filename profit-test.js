var test = require('tape');
var cal = require('./calendar');
var calc = require('./calculator');
var data = require('./data');

test('profits for april 2016', function(t) {
    t.plan(1);

    var netIncome = calc.getNetIncome(
        data.aprilExpensesConfig,
        data.aprilIncomeConfig);

    var expectedProfits = data.recurringIncomeApril2016 - data.recurringExpensesApril2016;
    t.equal(netIncome, expectedProfits, 'profits for april 2016: ' + netIncome);
});