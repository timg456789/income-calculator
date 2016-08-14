var test = require('tape');
var calc = require('../calculator');

test('profits for august 2016', function(t) {
    t.plan(1);

    var netIncome = calc.getNetIncome({
        monthExpenseConfig: {
            monthlyExpenses: [
                {name: 'rent',              amount: 550 * 100},
                {name: 'carInsurance',      amount: 307 * 100},
                {name: 'utilities',         amount: 200 * 100},
                {name: 'phone',             amount: 100 * 100},
                {name: 'gym',               amount: 15  * 100},
                {name: 'music'              amount: 10  * 100}
            ],
            weeklyExpenses: [
                {name: 'car',               amount: 125 * 100},
                {name: 'gas',               amount: 75  * 100},
                {name: 'food',              amount: 75 * 100}
            ],
            dayOfWeek: 5
        },
        monthIncomeConfig: {
            calendarConfig: {
                firstPayDateTime: new Date(2016, 2, 18),
                interval: 14
            },
            rate: 1335 * 100
        },
        oneTimeExpenses: [
            { name: 'full synthetic oil change',   amount: 100     * 100}
        ],
        timeRange: {
            startTime: new Date(2016, 7, 13).getTime(),
            endTime: new Date(2016, 8, 01).getTime()
        },
        savings: [
            {amount: 55000 },
            {amount: 15700 },
        ]
    });

    console.log(netIncome);

    t.equal(netIncome, 157534, "august 2016 net income: $" + (netIncome) / 100);
});

