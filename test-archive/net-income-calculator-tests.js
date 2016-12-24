const test = require('tape');
const NetIncomeCalculator = require('../src/net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

test('first of the month repeats on the 31 for december ', function(t) {
    t.plan(2);

    var settings = {
        "monthlyRecurringExpenses": [
            {
                "amount": 1000,
                "date": new Date("2016-12-01T00:00:00.000Z"),
                "name": "rent",
                "type": "expense"
            }
        ]
    };

    var budget = netIncomeCalculator.getBudget(settings, 1480550400000, 1483228800000);

    t.equal(budget.length, 1);
    t.equal(JSON.stringify(budget[0].date), '"2016-12-01T00:00:00.000Z"');
});
