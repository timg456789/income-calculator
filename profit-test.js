var test = require('tape');
var calc = require('./calculator');
var data = require('./data');

test('profits for april 2016', function(t) {
    t.plan(3);

    var oneTimeExpense = [{ amount: 320000 }];
    var savings =  [
        { amount: 126341 },
        { amount: 821 }
    ];

    var netIncome = calc.getNetIncome(
        data.aprilExpensesConfig,
        data.aprilIncomeConfig(),
        oneTimeExpense,
        savings
    );

    var expectedProfits = data.recurringIncomeApril2016 - data.recurringExpensesApril2016;
    expectedProfits = expectedProfits - oneTimeExpense[0].amount;
    t.equal(expectedProfits, -17535, 'profit or loss for month');
    t.equal(netIncome, expectedProfits, 'profits for april 2016: ' + netIncome);

    var total = expectedProfits + savings[0].amount + savings[1].amount;
    t.equal(total, 109627); // cents
});