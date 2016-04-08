var test = require('tape');
var cal = require('./calendar');
var calc = require('./calculator');

test('profits for april 2016', function(t) {
    t.plan(1);


    console.log(new Date(2016, 2, 26).getTime());

    var netIncome = calc.getNetIncome({
        monthExpenseConfig: {
            monthlyExpenses: [
                {name: "rent", amount: 550 * 100, date: 28},
                {name: "carInsurance", amount: 33535},
                {name: "utilities", amount: 165 * 100},
                {name: "phone", amount: 100 * 100}
            ],
            weeklyExpenses: [
                {name: "car", amount: 125 * 100}
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
        oneTimeExpenses: [{amount: 143200}],
        timeRange: {
            startTime: new Date(2016, 2, 26).getTime(),
            endTime: new Date(2016, 3, 27).getTime()
        },
        savings: [
            {amount: 126341},
            {amount: 821}
        ]
    });

    t.equal(netIncome, 83927); // rent shouldn't be included when ending on the 27th
});

