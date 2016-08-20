const cal = require('./calendar');
const test = require('tape');

const config = {
    monthlyRecurringExpenses: [
        { name: 'rent', amount: 550 * 100 },
        { name: 'car insurance', amount: 307  * 100 }/*, I need to start separating use cases from personal needs, because I need to limit test weight. I can plug these numbers in later and do so and start anonomizing the data.
        { name: 'utilities', amount: 200  * 100 },
        { name: 'student loan', amount: 117  * 100 },
        { name: 'phone', amount: 100  * 100 },
        { name: 'oil change', amount: 100  * 100 },
        { name: 'gym', amount: 15  * 100 },
        { name: 'music', amount: 10  * 100 }*/
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

    var current = new Date(startTime);
    while (current.getTime() < endTime) {
        if (current.getDate() == cal.SAFE_LAST_DAY_OF_MONTH) {
            for (i = 0; i < mrr.length; i++) {
                var processed = {};
                processed.name = mrr[i].name;
                processed.amount = mrr[i].amount;
                processed.dateIncurred = new Date(current.getTime());
                breakdown.push(processed);
            }
        }
        current.setDate(current.getDate() + 1);
    }

    return breakdown;
};

var breakdown = processor.process(
    config,
    new Date(2016, cal.SEPTEMBER, 1).getTime(), //start dae will be inclusive.
    new Date(2016, cal.NOVEMBER, 1).getTime()); //end date will be exclusive.

//monthlyRecurringExpensesExpected: 1399  * 100,
//weeklyExpensesExpected: 275  * 100,
//weeklyExpensesExpectedFourWeeks: 1100  * 100,
//weeklyExpensesExpectedFiveWeeks: 1375  * 100,

// weekly will be added next, but this is super complex.
// before I approach this complexity, I want to describe the process,
// which is more complex than the implementation of that process.
test('monthly expenses are being included', function(t) {
    t.plan(13);

    t.equal(breakdown.length, 4);
    t.equal(breakdown[0].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[0].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[0].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());

    t.equal(breakdown[0].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[0].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[0].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());

    t.equal(breakdown[1].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[1].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[1].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());

    t.equal(breakdown[1].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[1].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[1].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
});