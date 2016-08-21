const cal = require('./calendar');
const test = require('tape');

const NetIncomeCalculator = require('./net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const CalendarAggregator = require('./calendar-aggregator');
const calendarAggregator = new CalendarAggregator();

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
        { name: 'taxes', amount: 300 * 100, dateIncurred: new Date(2016, cal.APRIL, 17) },
        { name: 'taxes', amount: 400 * 100, dateIncurred: new Date(2016, cal.SEPTEMBER, 17) }
    ]
};

var breakdown = netIncomeCalculator.getBreakdown(
    config,
    new Date(2016, cal.SEPTEMBER, 1).getTime(), //start dae will be inclusive.
    new Date(2016, cal.NOVEMBER, 1).getTime()); //end date will be exclusive.

test('breakdown of income and expenses for a time period', function(t) {
    t.plan(69);

    t.equal(breakdown.length, 17);

    t.equal(breakdown[0].name, 'food');
    t.equal(breakdown[0].amount, 75 * 100);
    t.equal(breakdown[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 2).getTime());
    t.equal(breakdown[0].type, 'expense');

    t.equal(breakdown[1].name, 'biweekly income');
    t.equal(breakdown[1].amount, 1335 * 100);
    t.equal(breakdown[1].date.getTime(), new Date(2016, cal.SEPTEMBER, 2).getTime());
    t.equal(breakdown[1].type, 'income');

    t.equal(breakdown[2].name, 'food');
    t.equal(breakdown[2].amount, 75 * 100);
    t.equal(breakdown[2].date.getTime(), new Date(2016, cal.SEPTEMBER, 9).getTime());
    t.equal(breakdown[2].type, 'expense');

    t.equal(breakdown[3].name, 'food');
    t.equal(breakdown[3].amount, 75 * 100);
    t.equal(breakdown[3].date.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());
    t.equal(breakdown[3].type, 'expense');

    t.equal(breakdown[4].name, 'biweekly income');
    t.equal(breakdown[4].amount, 1335 * 100);
    t.equal(breakdown[4].date.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());
    t.equal(breakdown[4].type, 'income');

    t.equal(breakdown[5].name, 'taxes', 'one time expense name');
    t.equal(breakdown[5].amount, 400 * 100, 'one time expense amount');
    t.equal(breakdown[5].date.getTime(), new Date(2016, cal.SEPTEMBER, 17).getTime(), 'one time expense date');
    t.equal(breakdown[5].type, 'expense');

    t.equal(breakdown[6].name, 'food');
    t.equal(breakdown[6].amount, 75 * 100);
    t.equal(breakdown[6].date.getTime(), new Date(2016, cal.SEPTEMBER, 23).getTime());
    t.equal(breakdown[6].type, 'expense');

    t.equal(breakdown[7].name, 'rent');
    t.equal(breakdown[7].date.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[7].amount, 550 * 100);
    t.equal(breakdown[7].type, 'expense');

    t.equal(breakdown[8].name, 'food');
    t.equal(breakdown[8].amount, 75 * 100);
    t.equal(breakdown[8].date.getTime(), new Date(2016, cal.SEPTEMBER, 30).getTime());
    t.equal(breakdown[8].type, 'expense');

    t.equal(breakdown[9].name, 'biweekly income');
    t.equal(breakdown[9].amount, 1335 * 100);
    t.equal(breakdown[9].date.getTime(), new Date(2016, cal.SEPTEMBER, 30).getTime());
    t.equal(breakdown[9].type, 'income');

    // OCTOBER

    t.equal(breakdown[10].name, 'food');
    t.equal(breakdown[10].amount, 75 * 100);
    t.equal(breakdown[10].date.getTime(), new Date(2016, cal.OCTOBER, 7).getTime());
    t.equal(breakdown[10].type, 'expense');

    t.equal(breakdown[11].name, 'food');
    t.equal(breakdown[11].amount, 75 * 100);
    t.equal(breakdown[11].date.getTime(), new Date(2016, cal.OCTOBER, 14).getTime());
    t.equal(breakdown[11].type, 'expense');

    t.equal(breakdown[12].name, 'biweekly income');
    t.equal(breakdown[12].amount, 1335 * 100);
    t.equal(breakdown[12].date.getTime(), new Date(2016, cal.OCTOBER, 14).getTime());
    t.equal(breakdown[12].type, 'income');

    t.equal(breakdown[13].name, 'food');
    t.equal(breakdown[13].amount, 75 * 100);
    t.equal(breakdown[13].date.getTime(), new Date(2016, cal.OCTOBER, 21).getTime());
    t.equal(breakdown[13].type, 'expense');

    t.equal(breakdown[14].name, 'rent');
    t.equal(breakdown[14].amount, 550 * 100);
    t.equal(breakdown[14].date.getTime(), new Date(2016, cal.OCTOBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(breakdown[14].type, 'expense');

    t.equal(breakdown[15].name, 'food');
    t.equal(breakdown[15].amount, 75 * 100);
    t.equal(breakdown[15].date.getTime(), new Date(2016, cal.OCTOBER, 28).getTime());
    t.equal(breakdown[15].type, 'expense');

    t.equal(breakdown[16].name, 'biweekly income');
    t.equal(breakdown[16].amount, 1335 * 100);
    t.equal(breakdown[16].date.getTime(), new Date(2016, cal.OCTOBER, 28).getTime());
    t.equal(breakdown[16].type, 'income');

});

var weeklyTotals = calendarAggregator.getWeeklyTotals(breakdown);

test('aggregation of income and expenses by week', function(t) {
    t.plan(80);

    t.equal(weeklyTotals.length, 9, 'september and october weeks');

    t.equal(weeklyTotals[0].items.length, 2, 'september week 1 income and expense transactions');
    t.equal(weeklyTotals[0].netIncome, 1260 * 100, 'september week 1 net income');

    t.equal(weeklyTotals[0].items[0].name, 'food');
    t.equal(weeklyTotals[0].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[0].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 2).getTime());
    t.equal(weeklyTotals[0].items[0].type, 'expense');
    t.equal(weeklyTotals[0].items[1].name, 'biweekly income');
    t.equal(weeklyTotals[0].items[1].amount, 1335 * 100);
    t.equal(weeklyTotals[0].items[1].date.getTime(), new Date(2016, cal.SEPTEMBER, 2).getTime());
    t.equal(weeklyTotals[0].items[1].type, 'income');

    t.equal(weeklyTotals[1].items.length, 1);
    t.equal(weeklyTotals[1].netIncome, -75 * 100, 'september week 2 net income');

    t.equal(weeklyTotals[1].items[0].name, 'food');
    t.equal(weeklyTotals[1].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[1].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 9).getTime());
    t.equal(weeklyTotals[1].items[0].type, 'expense');

    t.equal(weeklyTotals[2].items.length, 3);
    t.equal(weeklyTotals[2].items[0].name, 'food');
    t.equal(weeklyTotals[2].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[2].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());
    t.equal(weeklyTotals[2].items[0].type, 'expense');
    t.equal(weeklyTotals[2].items[1].name, 'biweekly income');
    t.equal(weeklyTotals[2].items[1].amount, 1335 * 100);
    t.equal(weeklyTotals[2].items[1].date.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());
    t.equal(weeklyTotals[2].items[1].type, 'income');
    t.equal(weeklyTotals[2].items[2].name, 'taxes', 'one time expense name');
    t.equal(weeklyTotals[2].items[2].amount, 400 * 100, 'one time expense amount');
    t.equal(weeklyTotals[2].items[2].date.getTime(), new Date(2016, cal.SEPTEMBER, 17).getTime(), 'one time expense date');
    t.equal(weeklyTotals[2].items[2].type, 'expense');

    t.equal(weeklyTotals[3].items.length, 1);
    t.equal(weeklyTotals[3].items[0].name, 'food');
    t.equal(weeklyTotals[3].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[3].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 23).getTime());
    t.equal(weeklyTotals[3].items[0].type, 'expense');

    t.equal(weeklyTotals[4].items.length, 3);
    t.equal(weeklyTotals[4].items[0].name, 'rent');
    t.equal(weeklyTotals[4].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(weeklyTotals[4].items[0].amount, 550 * 100);
    t.equal(weeklyTotals[4].items[0].type, 'expense');
    t.equal(weeklyTotals[4].items[1].name, 'food');
    t.equal(weeklyTotals[4].items[1].amount, 75 * 100);
    t.equal(weeklyTotals[4].items[1].date.getTime(), new Date(2016, cal.SEPTEMBER, 30).getTime());
    t.equal(weeklyTotals[4].items[1].type, 'expense');
    t.equal(weeklyTotals[4].items[2].name, 'biweekly income');
    t.equal(weeklyTotals[4].items[2].amount, 1335 * 100);
    t.equal(weeklyTotals[4].items[2].date.getTime(), new Date(2016, cal.SEPTEMBER, 30).getTime());
    t.equal(weeklyTotals[4].items[2].type, 'income');

    t.equal(weeklyTotals[5].items.length, 1);
    t.equal(weeklyTotals[5].items[0].name, 'food');
    t.equal(weeklyTotals[5].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[5].items[0].date.getTime(), new Date(2016, cal.OCTOBER, 7).getTime());
    t.equal(weeklyTotals[5].items[0].type, 'expense');

    t.equal(weeklyTotals[6].items.length, 2);
    t.equal(weeklyTotals[6].items[0].name, 'food');
    t.equal(weeklyTotals[6].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[6].items[0].date.getTime(), new Date(2016, cal.OCTOBER, 14).getTime());
    t.equal(weeklyTotals[6].items[0].type, 'expense');

    t.equal(weeklyTotals[6].items[1].name, 'biweekly income');
    t.equal(weeklyTotals[6].items[1].amount, 1335 * 100);
    t.equal(weeklyTotals[6].items[1].date.getTime(), new Date(2016, cal.OCTOBER, 14).getTime());
    t.equal(weeklyTotals[6].items[1].type, 'income');

    t.equal(weeklyTotals[7].items.length, 1);
    t.equal(weeklyTotals[7].items[0].name, 'food');
    t.equal(weeklyTotals[7].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[7].items[0].date.getTime(), new Date(2016, cal.OCTOBER, 21).getTime());
    t.equal(weeklyTotals[7].items[0].type, 'expense');

    t.equal(weeklyTotals[8].items.length, 3);
    t.equal(weeklyTotals[8].items[0].name, 'rent');
    t.equal(weeklyTotals[8].items[0].amount, 550 * 100);
    t.equal(weeklyTotals[8].items[0].date.getTime(), new Date(2016, cal.OCTOBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(weeklyTotals[8].items[0].type, 'expense');
    t.equal(weeklyTotals[8].items[1].name, 'food');
    t.equal(weeklyTotals[8].items[1].amount, 75 * 100);
    t.equal(weeklyTotals[8].items[1].date.getTime(), new Date(2016, cal.OCTOBER, 28).getTime());
    t.equal(weeklyTotals[8].items[1].type, 'expense');
    t.equal(weeklyTotals[8].items[2].name, 'biweekly income');
    t.equal(weeklyTotals[8].items[2].amount, 1335 * 100);
    t.equal(weeklyTotals[8].items[2].date.getTime(), new Date(2016, cal.OCTOBER, 28).getTime());
    t.equal(weeklyTotals[8].items[2].type, 'income');

});

var monthlyTotals = calendarAggregator.getMonthlyTotals(weeklyTotals);

test('aggregation of income and expenses by month', function(t) {
    t.plan(12);
    t.equal(monthlyTotals.length, 2);
    t.equal(monthlyTotals[0].length, 5);
    t.equal(monthlyTotals[1].length, 4);

    t.equal(monthlyTotals[0][0].length, 2);
    t.equal(monthlyTotals[0][1].length, 1);
    t.equal(monthlyTotals[0][2].length, 3);
    t.equal(monthlyTotals[0][3].length, 1);
    t.equal(monthlyTotals[0][4].length, 3);

    t.equal(monthlyTotals[1][0].length, 1);
    t.equal(monthlyTotals[1][1].length, 2);
    t.equal(monthlyTotals[1][2].length, 1);
    t.equal(monthlyTotals[1][3].length, 3);

});

test('calculate net income by week', function(t) {
    t.plan(1);

    t.equal(1, 1);
});
