const cal = require('./calendar');
const test = require('tape');

const config = {
    monthlyRecurringExpenses: [
        { name: 'rent', amount: 550 * 100 }
    ],
    weeklyRecurringExpenses: [
        { name: 'food', amount: 75  * 100 }
    ],
    biWeeklyIncome: {
        amount: 1335  * 100,
        type: 'bi-weekly',
        expectedFourWeeks: 2670  * 100,
        expectedFiveWeeks: 4005  * 100
    }
};

var processor = {};
processor.process = function(config, startTime, endTime) {
    var breakdown = [];
    var mre = config.monthlyRecurringExpenses;
    var wre = config.weeklyRecurringExpenses;

    var current = new Date(startTime);
    while (current.getTime() < endTime) {
        if (current.getDate() == cal.SAFE_LAST_DAY_OF_MONTH) {
            for (i = 0; i < mre.length; i++) {
                var processed = {};
                processed.name = mre[i].name;
                processed.amount = mre[i].amount;
                processed.dateIncurred = new Date(current.getTime());
                breakdown.push(processed);
            }
        }

        if (current.getDay() == cal.FRIDAY) {
            for (i = 0; i < wre.length; i++) {
                var processed = {};
                processed.name = wre[i].name;
                processed.amount = wre[i].amount;
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
    t.plan(34);

    //console.log(breakdown);

    t.equal(breakdown.length, 11);

    t.equal(breakdown[0].name, 'food');
    t.equal(breakdown[0].amount, 75 * 100);
    t.equal(breakdown[0].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 2).getTime());

    t.equal(breakdown[1].name, 'food');
    t.equal(breakdown[1].amount, 75 * 100);
    t.equal(breakdown[1].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 9).getTime());

    t.equal(breakdown[2].name, 'food');
    t.equal(breakdown[2].amount, 75 * 100);
    t.equal(breakdown[2].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());

    t.equal(breakdown[3].name, 'food');
    t.equal(breakdown[3].amount, 75 * 100);
    t.equal(breakdown[3].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 23).getTime());

    t.equal(breakdown[4].name, 'rent');
    t.equal(breakdown[4].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[4].amount, 550 * 100);

    t.equal(breakdown[5].name, 'food');
    t.equal(breakdown[5].amount, 75 * 100);
    t.equal(breakdown[5].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 30).getTime());

    // OCTOBER

    t.equal(breakdown[6].name, 'food');
    t.equal(breakdown[6].amount, 75 * 100);
    t.equal(breakdown[6].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, 7).getTime());

    t.equal(breakdown[7].name, 'food');
    t.equal(breakdown[7].amount, 75 * 100);
    t.equal(breakdown[7].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, 14).getTime());

    t.equal(breakdown[8].name, 'food');
    t.equal(breakdown[8].amount, 75 * 100);
    t.equal(breakdown[8].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, 21).getTime());

    t.equal(breakdown[9].name, 'rent');
    t.equal(breakdown[9].amount, 550 * 100);
    t.equal(breakdown[9].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());

    t.equal(breakdown[10].name, 'food');
    t.equal(breakdown[10].amount, 75 * 100);
    t.equal(breakdown[10].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, 28).getTime());

});