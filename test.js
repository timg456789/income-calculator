const cal = require('./calendar');
const test = require('tape');

const config = {
    monthlyRecurringExpenses: [
        { name: 'rent', amount: 550 * 100 },
        { name: 'car insurance', amount: 307  * 100 },
        { name: 'utilities', amount: 200  * 100 },
        { name: 'student loan', amount: 117  * 100 },
        { name: 'phone', amount: 100  * 100 },
        { name: 'oil change', amount: 100  * 100 },
        { name: 'gym', amount: 15  * 100 },
        { name: 'music', amount: 10  * 100 }
    ],
    weeklyRecurringExpenses: [
        { name: 'car', amount: 125  * 100 },
        { name: 'gas', amount: 75  * 100 },
        { name: 'food', amount: 75  * 100 }
    ],
    income: {
        amount: 1335  * 100,
        type: 'bi-weekly',
        expectedFourWeeks: 2670  * 100,
        expectedFiveWeeks: 4005  * 100
    }
};

var processor = {};
processor.process = function(config, startTime, endTime) {
    var breakdown = [];
    var mrr = config.monthlyRecurringExpenses;

    for (i = 0; i < mrr.length; i++) {
        breakdown.push({});
    }

    console.log(new Date(startTime));
    console.log(new Date(endTime));

    return breakdown;
};

var septemberBreakdown = processor.process(
    config,
    new Date(2016, cal.SEPTEMBER, 1).getTime(), //start dae will be inclusive.
    new Date(2016, cal.OCTOBER, 1).getTime()); //end date will be exclusive.

//monthlyRecurringExpensesExpected: 1399  * 100,
//weeklyExpensesExpected: 275  * 100,
//weeklyExpensesExpectedFourWeeks: 1100  * 100,
//weeklyExpensesExpectedFiveWeeks: 1375  * 100,

// weekly will be added next, but this is super complex.
// before I approach this complexity, I want to describe the process,
// which is more complex than the implementation of that process.
test('monthly expenses are being included', function(t) {
    t.plan(1);

    t.equal(septemberBreakdown.length, 8);
});