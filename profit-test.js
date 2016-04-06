var test = require('tape');
var calc = require('./calculator');
var data = require('./data');

test('profits for april 2016', function(t) {
    t.plan(2);

    var oneTimeExpense = [{ amount: 320000 }];

    var netIncome = calc.getNetIncome(
        data.aprilExpensesConfig,
        data.aprilIncomeConfig(),
        oneTimeExpense
    );

    var expectedProfits = data.recurringIncomeApril2016 - data.recurringExpensesApril2016;
    expectedProfits = expectedProfits - oneTimeExpense[0].amount;
    t.equal(expectedProfits, -17535, 'profit or loss for month');
    t.equal(netIncome, expectedProfits, 'profits for april 2016: ' + netIncome);
});

test('projected net assets starting march 1 2016', function(t) {
    t.plan(1);

    var savings =  [
        { amount: 126341 },
        { amount: 821 }
    ];
    var projectedMonthNetIncome = -17535;
    var expect = projectedMonthNetIncome + savings[0].amount + savings[1].amount;
    t.equal(expect, 109627);
});
