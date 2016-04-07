var test = require('tape');
var cal = require('./calendar');
var calc = require('./calculator');
var data = require('./data');

test('profits for april 2016', function(t) {
    t.plan(3);

    var oneTimeExpense = [{ amount: 320000 }];

    var netIncome = calc.getNetIncome(
        {
            monthlyExpenses: data.monthlyExpenses,
            weeklyExpenses: data.weeklyExpenses,
            dayOfWeek: cal.FRIDAY
        },
        {
            calendarConfig: cal.BIWEEKLY_CALENDAR_CONFIG,
            rate: data.biweeklyRate
        },
        oneTimeExpense,
        {
            startTime: new Date(2016, 2, 26).getTime(),
            endTime: new Date(2016, 3, 30).getTime()
        }
    );

    var expectedNetIncome = data.recurringIncomeApril2016 - data.recurringExpensesApril2016;
    expectedNetIncome = expectedNetIncome - oneTimeExpense[0].amount;
    t.equal(expectedNetIncome, -17535, 'profit or loss for month');
    t.equal(netIncome, expectedNetIncome, 'profits for april 2016: ' + netIncome);

    var savings =  [
        { amount: 126341 },
        { amount: 821 }
    ];

    var expect = netIncome + savings[0].amount + savings[1].amount;
    t.equal(expect, 109627);
});

