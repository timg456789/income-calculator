const cal = require('./calendar');
const test = require('tape');

const NetIncomeCalculator = require('./net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const config = {
    monthlyRecurringExpenses: [
        { name: 'rent', amount: 550 * 100 }
    ],
    weeklyRecurringExpenses: [
        { name: 'food', amount: 75  * 100 }
    ],
    biWeeklyIncome: {
        amount: 1335  * 100
    },
    oneTimeExpenses: [
        { name: 'taxes', amount: 400 * 100, dateIncurred: new Date(2016, cal.SEPTEMBER, 17) }
    ]
};

var breakdown = netIncomeCalculator.getBreakdown(
    config,
    new Date(2016, cal.SEPTEMBER, 1).getTime(), //start dae will be inclusive.
    new Date(2016, cal.NOVEMBER, 1).getTime()); //end date will be exclusive.

test('monthly expenses are being included', function(t) {
    t.plan(49);

    t.equal(breakdown.length, 16);

    t.equal(breakdown[0].name, 'food');
    t.equal(breakdown[0].amount, 75 * 100);
    t.equal(breakdown[0].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 2).getTime());

    t.equal(breakdown[1].name, 'biweekly income');
    t.equal(breakdown[1].amount, 1335 * 100);
    t.equal(breakdown[1].dateAccrued.getTime(), new Date(2016, cal.SEPTEMBER, 2).getTime());

    t.equal(breakdown[2].name, 'food');
    t.equal(breakdown[2].amount, 75 * 100);
    t.equal(breakdown[2].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 9).getTime());

    t.equal(breakdown[3].name, 'food');
    t.equal(breakdown[3].amount, 75 * 100);
    t.equal(breakdown[3].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());

    /*
    t.equal(breakdown[4].name, 'taxes');
    t.equal(breakdown[4].amount, 400 * 100);
    t.equal(breakdown[4].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 17).getTime());
*/
    
    t.equal(breakdown[4].name, 'biweekly income');
    t.equal(breakdown[4].amount, 1335 * 100);
    t.equal(breakdown[4].dateAccrued.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());

    t.equal(breakdown[5].name, 'food');
    t.equal(breakdown[5].amount, 75 * 100);
    t.equal(breakdown[5].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 23).getTime());

    t.equal(breakdown[6].name, 'rent');
    t.equal(breakdown[6].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[6].amount, 550 * 100);

    t.equal(breakdown[7].name, 'food');
    t.equal(breakdown[7].amount, 75 * 100);
    t.equal(breakdown[7].dateIncurred.getTime(), new Date(2016, cal.SEPTEMBER, 30).getTime());

    t.equal(breakdown[8].name, 'biweekly income');
    t.equal(breakdown[8].amount, 1335 * 100);
    t.equal(breakdown[8].dateAccrued.getTime(), new Date(2016, cal.SEPTEMBER, 30).getTime());

    // OCTOBER

    t.equal(breakdown[9].name, 'food');
    t.equal(breakdown[9].amount, 75 * 100);
    t.equal(breakdown[9].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, 7).getTime());

    t.equal(breakdown[10].name, 'food');
    t.equal(breakdown[10].amount, 75 * 100);
    t.equal(breakdown[10].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, 14).getTime());

    t.equal(breakdown[11].name, 'biweekly income');
    t.equal(breakdown[11].amount, 1335 * 100);
    t.equal(breakdown[11].dateAccrued.getTime(), new Date(2016, cal.OCTOBER, 14).getTime());

    t.equal(breakdown[12].name, 'food');
    t.equal(breakdown[12].amount, 75 * 100);
    t.equal(breakdown[12].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, 21).getTime());

    t.equal(breakdown[13].name, 'rent');
    t.equal(breakdown[13].amount, 550 * 100);
    t.equal(breakdown[13].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());

    t.equal(breakdown[14].name, 'food');
    t.equal(breakdown[14].amount, 75 * 100);
    t.equal(breakdown[14].dateIncurred.getTime(), new Date(2016, cal.OCTOBER, 28).getTime());

    t.equal(breakdown[15].name, 'biweekly income');
    t.equal(breakdown[15].amount, 1335 * 100);
    t.equal(breakdown[15].dateAccrued.getTime(), new Date(2016, cal.OCTOBER, 28).getTime());

});