var test = require('tape');
var cal = require('./calendar');
var calc = require('./calculator');
var data = require('./data');

test('profits for april 2016', function(t) {
    t.plan(2);

    var oneTimeExpense = 3200 * 100;

    var netIncome = calc.getNetIncome(
        data.aprilExpensesConfig,
        data.aprilIncomeConfig(),
        [{ amount: oneTimeExpense }]
    );

    var expectedProfits = data.recurringIncomeApril2016 - data.recurringExpensesApril2016;
    expectedProfits = expectedProfits - oneTimeExpense;
    t.equal(expectedProfits, -17535);
    t.equal(netIncome, expectedProfits, 'profits for april 2016: ' + netIncome);
});