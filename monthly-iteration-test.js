const cal = require('./calendar');

const NetIncomeCalculator = require('./net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const CalendarAggregator = require('./calendar-aggregator');
const calendarAggregator = new CalendarAggregator();

const MonthlyTotals = require('./monthly-totals');
const monthlyTotals = new MonthlyTotals();

const config = {
    monthlyRecurringExpenses: [
        { name: 'rent', amount: 550 * 100, date: new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH) },
        { name: 'utilities', amount: 100 * 100, date: new Date(2016, cal.SEPTEMBER, 20)  }
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
    new Date(2017, cal.AUGUST, 1).getTime(),
    new Date(2017, cal.OCTOBER, 1).getTime());

var weeklyTotals = calendarAggregator.getWeeklyTotals(breakdown);
var totalForMonth = monthlyTotals.getMonthlyTotals(weeklyTotals);

console.log(JSON.stringify(totalForMonth, 0, 4));

const test = require('tape');
test('2017 aug 1 to 2017 oct 1', function(t) {
    t.plan(1);
    t.equal(totalForMonth.length, 2);
});
