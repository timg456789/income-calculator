const cal = require('./src/calendar');
const test = require('tape');

const NetIncomeCalculator = require('./src/net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const CalendarAggregator = require('./src/calendar-aggregator');
const calendarAggregator = new CalendarAggregator();

const MonthlyTotals = require('./src/monthly-totals');
const monthlyTotals = new MonthlyTotals();

const budgetSettings = {
    monthlyRecurringExpenses: [
        { name: 'rent', amount: 550 * 100 },
        { name: 'utilities', amount: 100 * 100, date: new Date(2016, cal.SEPTEMBER, 20)  }
    ],
    weeklyRecurringExpenses: [
        { name: 'food', amount: 75  * 100 }
    ],
    biWeeklyIncome: {
        amount: 1335  * 100
    },
    oneTimeExpenses: [
        { name: 'taxes', amount: 300 * 100, date: new Date(2016, cal.APRIL, 17) },
        { name: 'taxes', amount: 400 * 100, date: new Date(2016, cal.SEPTEMBER, 17) }
    ]
};

var budget = netIncomeCalculator.getBudget(
    budgetSettings,
    new Date(2016, cal.SEPTEMBER, 1).getTime(), //start dae will be inclusive.
    new Date(2016, cal.NOVEMBER, 1).getTime()); //end date will be exclusive.


var actual = [
    {
        name: 'groceries',
        amount: 50 * 100,
        date: new Date(2016, cal.SEPTEMBER, 3),
        type: 'expense',
        budget: 'food'
    },
    {
        name: 'groceries',
        amount: 50 * 100,
        date: new Date(2016, cal.SEPTEMBER, 16),
        type: 'expense',
        budget: 'food'
    },
    {
        name: 'groceries',
        amount: 50 * 100,
        date: new Date(2016, cal.SEPTEMBER, 17),
        type: 'expense',
        budget: 'food'
    }
];

var weeklyTotals = calendarAggregator.getWeeklyTotals(budget, actual);

test('aggregation of income and expenses by week', function(t) {
    t.plan(110);

    t.equal(weeklyTotals.length, 9, 'september and october weeks');

    t.equal(weeklyTotals[0].items.length, 3, 'september week 1 budgeted income, expenses and actual expenses');
    t.equal(weeklyTotals[0].net, 1260 * 100, 'september week 1 net income');
    t.equal(weeklyTotals[0].budgets['food'], 25 * 100, 'september week 1 food budget balance');

    t.equal(weeklyTotals[0].items[0].name, 'food');
    t.equal(weeklyTotals[0].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[0].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 2).getTime());
    t.equal(weeklyTotals[0].items[0].type, 'expense');

    t.equal(weeklyTotals[0].items[1].name, 'groceries');
    t.equal(weeklyTotals[0].items[1].amount, 50 * 100);
    t.equal(weeklyTotals[0].items[1].date.getTime(), new Date(2016, cal.SEPTEMBER, 3).getTime());
    t.equal(weeklyTotals[0].items[1].type, 'expense');

    t.equal(weeklyTotals[0].items[2].name, 'biweekly income');
    t.equal(weeklyTotals[0].items[2].amount, 1335 * 100);
    t.equal(weeklyTotals[0].items[2].date.getTime(), new Date(2016, cal.SEPTEMBER, 2).getTime());
    t.equal(weeklyTotals[0].items[2].type, 'income');

    t.equal(weeklyTotals[1].items.length, 1, 'september week 2 transactions');
    t.equal(weeklyTotals[1].net, -75 * 100, 'september week 2 net income');
    t.equal(weeklyTotals[1].budgets['food'], 75 * 100, 'september week 2 food budget balance');

    t.equal(weeklyTotals[1].items[0].name, 'food', 'september 9th food');
    t.equal(weeklyTotals[1].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[1].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 9).getTime());
    t.equal(weeklyTotals[1].items[0].type, 'expense');

    t.equal(weeklyTotals[2].items.length, 5, 'september week 3 budgeted income, expense and actual expenses');
    t.equal(weeklyTotals[2].net, 835 * 100, 'september week 3 net income');
    t.equal(weeklyTotals[2].budgets['food'], -25 * 100, 'september week 3 negative food budget balance');

    t.equal(weeklyTotals[2].items[0].name, 'food', 'september week 3 budgeted food');
    t.equal(weeklyTotals[2].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[2].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());
    t.equal(weeklyTotals[2].items[0].type, 'expense');

    t.equal(weeklyTotals[2].items[1].name, 'groceries', 'september week 3 actual expense');
    t.equal(weeklyTotals[2].items[1].amount, 50 * 100);
    t.equal(weeklyTotals[2].items[1].date.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());
    t.equal(weeklyTotals[2].items[1].type, 'expense');

    t.equal(weeklyTotals[2].items[2].name, 'groceries', 'september week 3 actual expense');
    t.equal(weeklyTotals[2].items[2].amount, 50 * 100);
    t.equal(weeklyTotals[2].items[2].date.getTime(), new Date(2016, cal.SEPTEMBER, 17).getTime());
    t.equal(weeklyTotals[2].items[2].type, 'expense');

    t.equal(weeklyTotals[2].items[3].name, 'biweekly income', 'september week 3 biweekly income');
    t.equal(weeklyTotals[2].items[3].amount, 1335 * 100);
    t.equal(weeklyTotals[2].items[3].date.getTime(), new Date(2016, cal.SEPTEMBER, 16).getTime());
    t.equal(weeklyTotals[2].items[3].type, 'income');
    t.equal(weeklyTotals[2].items[4].name, 'taxes', 'one time expense name');
    t.equal(weeklyTotals[2].items[4].amount, 400 * 100, 'one time expense amount');
    t.equal(weeklyTotals[2].items[4].date.getTime(), new Date(2016, cal.SEPTEMBER, 17).getTime(), 'one time expense date');
    t.equal(weeklyTotals[2].items[4].type, 'expense');

    t.equal(weeklyTotals[3].items.length, 2);
    t.equal(weeklyTotals[3].net, -175 * 100, 'september week 4 net income');

    t.equal(weeklyTotals[3].items[0].name, 'utilities', 'utilities september 20');
    t.equal(weeklyTotals[3].items[0].amount, 100 * 100);
    t.equal(weeklyTotals[3].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 20).getTime());
    t.equal(weeklyTotals[3].items[0].type, 'expense');

    t.equal(weeklyTotals[3].items[1].name, 'food', 'food september 23');
    t.equal(weeklyTotals[3].items[1].amount, 75 * 100);
    t.equal(weeklyTotals[3].items[1].date.getTime(), new Date(2016, cal.SEPTEMBER, 23).getTime());
    t.equal(weeklyTotals[3].items[1].type, 'expense');

    t.equal(weeklyTotals[4].items.length, 3, 'september week 5 transactions');
    t.equal(weeklyTotals[4].net, 710 * 100, 'september week 5 net income');

    t.equal(weeklyTotals[4].items[0].name, 'rent');
    t.equal(weeklyTotals[4].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH).getTime());
    t.equal(weeklyTotals[4].items[0].amount, 550 * 100);
    t.equal(weeklyTotals[4].items[0].type, 'expense');

    t.equal(weeklyTotals[4].items[1].name, 'food', 'food september 30');
    t.equal(weeklyTotals[4].items[1].amount, 75 * 100);
    t.equal(weeklyTotals[4].items[1].date.getTime(), new Date(2016, cal.SEPTEMBER, 30).getTime());
    t.equal(weeklyTotals[4].items[1].type, 'expense');

    t.equal(weeklyTotals[4].items[2].name, 'biweekly income');
    t.equal(weeklyTotals[4].items[2].amount, 1335 * 100);
    t.equal(weeklyTotals[4].items[2].date.getTime(), new Date(2016, cal.SEPTEMBER, 30).getTime());
    t.equal(weeklyTotals[4].items[2].type, 'income');

    t.equal(weeklyTotals[5].items.length, 1);
    t.equal(weeklyTotals[5].net, -75 * 100, 'october week 1 net income');

    t.equal(weeklyTotals[5].items[0].name, 'food', 'food october 7');
    t.equal(weeklyTotals[5].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[5].items[0].date.getTime(), new Date(2016, cal.OCTOBER, 7).getTime());
    t.equal(weeklyTotals[5].items[0].type, 'expense');

    t.equal(weeklyTotals[6].items.length, 2);
    t.equal(weeklyTotals[6].net, 1260 * 100, 'october week 2 net income');

    t.equal(weeklyTotals[6].items[0].name, 'food');
    t.equal(weeklyTotals[6].items[0].amount, 75 * 100);
    t.equal(weeklyTotals[6].items[0].date.getTime(), new Date(2016, cal.OCTOBER, 14).getTime());
    t.equal(weeklyTotals[6].items[0].type, 'expense');

    t.equal(weeklyTotals[6].items[1].name, 'biweekly income');
    t.equal(weeklyTotals[6].items[1].amount, 1335 * 100);
    t.equal(weeklyTotals[6].items[1].date.getTime(), new Date(2016, cal.OCTOBER, 14).getTime());
    t.equal(weeklyTotals[6].items[1].type, 'income');

    t.equal(weeklyTotals[7].items.length, 2, 'october week 3 transactions');
    t.equal(weeklyTotals[7].net, -175 * 100, 'october week 3 net income');

    t.equal(weeklyTotals[7].items[0].name, 'utilities');
    t.equal(weeklyTotals[7].items[0].amount, 100 * 100);
    t.equal(weeklyTotals[7].items[0].date.getTime(), new Date(2016, cal.OCTOBER, 20).getTime());
    t.equal(weeklyTotals[7].items[0].type, 'expense');

    t.equal(weeklyTotals[7].items[1].name, 'food');
    t.equal(weeklyTotals[7].items[1].amount, 75 * 100);
    t.equal(weeklyTotals[7].items[1].date.getTime(), new Date(2016, cal.OCTOBER, 21).getTime());
    t.equal(weeklyTotals[7].items[1].type, 'expense');

    t.equal(weeklyTotals[8].items.length, 3);
    t.equal(weeklyTotals[8].net, 710 * 100, 'october week 4 net income');

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

var totalsForMonth = monthlyTotals.getMonthlyTotals(weeklyTotals);

test('aggregation of income and expenses by month', function(t) {
    t.plan(27);
    t.equal(totalsForMonth.length, 2);

    //console.log(JSON.stringify(totalsForMonth, 0, 4));

    t.equal(totalsForMonth[0].items.length, 5);
    t.equal(totalsForMonth[0].net, 2555 * 100, 'september net income');
    t.equal(totalsForMonth[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 1).getTime());

    t.equal(totalsForMonth[0].items[0].items.length, 3, 'september week 1 budgeted income expense and actual expenses');
    t.equal(totalsForMonth[0].items[0].net, 1260 * 100, 'september week 1 net income');
    t.equal(totalsForMonth[0].items[0].date.getTime(), new Date(2016, cal.SEPTEMBER, 1).getTime());

    t.equal(totalsForMonth[0].items[1].items.length, 1);
    t.equal(totalsForMonth[0].items[1].net, -75 * 100, 'september week 2 net income');
    t.equal(totalsForMonth[0].items[1].date.getTime(), new Date(2016, cal.SEPTEMBER, 4).getTime());

    t.equal(totalsForMonth[0].items[2].items.length, 5, 'september week 3 budgeted income expense and actual expenses');
    t.equal(totalsForMonth[0].items[2].net, 835 * 100, 'september week 3 net income');
    t.equal(totalsForMonth[0].items[3].items.length, 2);
    t.equal(totalsForMonth[0].items[3].net, -175 * 100, 'september week 4 net income');
    t.equal(totalsForMonth[0].items[4].items.length, 3);
    t.equal(totalsForMonth[0].items[4].net, 710 * 100), 'september week 5 net income';

    t.equal(totalsForMonth[1].items.length, 4);
    t.equal(totalsForMonth[1].net, 1720 * 100, 'october net income');
    t.equal(totalsForMonth[1].date.getTime(), new Date(2016, cal.OCTOBER, 1).getTime());

    t.equal(totalsForMonth[1].items[0].items.length, 1);
    t.equal(totalsForMonth[1].items[0].net, -75 * 100, 'october week 1 net income');
    t.equal(totalsForMonth[1].items[1].items.length, 2);
    t.equal(totalsForMonth[1].items[1].net, 1260 * 100, 'october week 2 net income');
    t.equal(totalsForMonth[1].items[2].items.length, 2);
    t.equal(totalsForMonth[1].items[2].net, -175 * 100, 'october week 3 net income');
    t.equal(totalsForMonth[1].items[3].items.length, 3);
    t.equal(totalsForMonth[1].items[3].net, 710 * 100, 'october week 4 net income');

});
