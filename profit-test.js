var test = require('tape');
var cal = require('./calendar');
var calc = require('./calculator');

test('profits for april 2016', function(t) {
    t.plan(1);

    var netIncome = calc.getNetIncome({
        monthExpenseConfig: {
            monthlyExpenses: [
                {name: "rent",              amount: 55000},
                {name: "carInsurance",      amount: 33535},
                {name: "utilities",         amount: 16500},
                {name: "phone",             amount: 10000}
            ],
            weeklyExpenses: [
                {name: "car",               amount: 12500},
                {name: "gas",               amount: 9000},
                {name: "food",              amount: 10000},
                {name: "misc",              amount:  5500}
            ],
            dayOfWeek: 5
        },
        monthIncomeConfig: {
            calendarConfig: {
                firstPayDateTime: new Date(2016, 2, 18),
                interval: 14
            },
            rate: 1600 * 100
        },
        oneTimeExpenses: [
            { name: "dentist", amount: 143200},
            { name: "taxes", amount: 42000 }
        ],
        timeRange: {
            startTime: new Date(2016, 3, 1).getTime(),
            endTime: new Date(2016, 4, 0).getTime()
        },
        savings: [
            {amount: 126341},
            {amount: 821}
        ]
    });

    t.equal(netIncome, 121927, "apriil 2016 net income: " + netIncome);
});

