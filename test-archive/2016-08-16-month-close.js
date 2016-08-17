var test = require('tape');
var calc = require('../calculator');

console.log(new Date(2016, 7, 16));

test('profits and losses for august 2016', function(t) {
    t.plan(1);

    var netIncome = calc.getNetIncome({
        monthExpenseConfig: {
            monthlyExpenses: [
                {name: 'rent',               amount: 550 * 100},
                {name: 'carInsurance',       amount: 307 * 100},
                {name: 'utilities',          amount: 200 * 100},
                {name: 'phone',              amount: 100 * 100},
                {name: 'gym',                amount: 15  * 100},
                {name: 'music',              amount: 10  * 100}
            ],
            weeklyExpenses: [
                {name: 'car',               amount: 125 * 100},
                {name: 'gas',               amount: 75  * 100},
                {name: 'food',              amount: 50 * 100}
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
            /*
            I'm going to have to wait until september for an oil change even though I'm past 3k miles today.
            { name: 'full synthetic oil change',   amount: 100     * 100}
            */
        ],
        timeRange: {
            startTime: new Date(2016, 7, 16).getTime(),
            endTime: new Date(2016, 8, 01).getTime()
        },
        savings: [
            /* I'm really low here, because I had to pay 150 for glasses today,
               and I needed to pay $200 for a cheap laptop so that I could keep working at home.
             */
            {amount: 1259 },
            {amount: 915 },
            {amount:  21 }
        ]
    });

    console.log(netIncome);

    t.equal(netIncome, -37505, "august 2016 net income: $" + (netIncome) / 100);
});