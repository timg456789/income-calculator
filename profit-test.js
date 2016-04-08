var test = require('tape');
var cal = require('./calendar');
var calc = require('./calculator');
var data = require('./data');

test('profits for april 2016', function(t) {
    t.plan(1);

    var oneTimeExpense = [{ amount: 143200 }];

    var netIncome = calc.getNetIncome(
        {
            monthlyExpenses: [
                { name: "rent", amount: 550 * 100, date: 28 },
                { name: "carInsurance", amount: 33535 },
                { name: "utilities", amount: 165 * 100 },
                { name: "phone", amount: 100 * 100 }
            ],
            weeklyExpenses: [
                { name: "car", amount: 125 * 100 }
            ],
            dayOfWeek: cal.FRIDAY
        },
        {
            calendarConfig: cal.BIWEEKLY_CALENDAR_CONFIG,
            rate: data.biweeklyRate
        },
        oneTimeExpense,
        {
            startTime: new Date(2016, 2, 26).getTime(),
            endTime: new Date(2016, 3, 27).getTime()
        }
    );

    var savings =  [
        { amount: 126341 },
        { amount: 821 }
    ];

    var expect = netIncome + savings[0].amount + savings[1].amount;
    t.equal(expect, 83927);
});

