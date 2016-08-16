var test = require('tape');
var calc = require('../calculator');

test('profits for july 2016', function(t) {
    t.plan(1);

    var netIncome = calc.getNetIncome({
        monthExpenseConfig: {
            monthlyExpenses: [
                {name: 'rent',              amount: 550 * 100},//
                {name: 'carInsurance',      amount: 300 * 100},//
                {name: 'utilities',         amount: 200 * 100},//
                {name: 'phone',             amount: 100 * 100},//
                {name: 'savings deposit',   amount:  42 * 100}//
            ],
            weeklyExpenses: [
                {name: 'car',               amount: 125 * 100},//
                {name: 'gas',               amount: 90  * 100},//
                {name: 'food',              amount: 100 * 100},//
                {name: 'petty cash',        amount: 55  * 100}//
            ],
            dayOfWeek: 5
        },
        monthIncomeConfig: {
            calendarConfig: {
                firstPayDateTime: new Date(2016, 2, 18),
                interval: 14
            },
            rate: 1336 * 100
        },
        oneTimeExpenses: [
            { name: 'dentist (dental implant)',    amount: 1500    * 100},
            { name: 'full synthetic oil change',   amount: 100     * 100},
            { name: 'a/c compressor',              amount: 100     * 100},
        ],
        timeRange: {
            startTime: new Date(2016, 6, 08).getTime(),
            endTime: new Date(2016, 7, 01).getTime()
        },
        savings: [
            {amount: 170417 },
            {amount: 117896 },
            {amount: 35021  }
        ]
    });

    console.log(netIncome);

    t.equal(netIncome, 153334, "july 2016 net income: $" + (netIncome) / 100);
});

