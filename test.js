const cal = require('./src/calendar');
const test = require('tape');

const NetIncomeCalculator = require('./src/net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const CalendarAggregator = require('./src/calendar-aggregator');
const calendarAggregator = new CalendarAggregator();

const CalendarSearch = require('./src/calendar-search');
const calendarSearch = new CalendarSearch();

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
    new Date(2016, cal.SEPTEMBER, 1).getTime(), //start date shall be inclusive.
    new Date(2016, cal.NOVEMBER, 1).getTime()); //end date shall be exclusive.

var actual = [
    {
        name: 'groceries',
        amount: 50 * 100,
        date: new Date(2016, cal.SEPTEMBER, 2),
        type: 'expense',
        budget: 'food'
    },
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
        date: new Date(2016, cal.SEPTEMBER, 17),
        type: 'expense',
        budget: 'food'
    },
    {
        name: 'ice cream',
        amount: 10 * 100,
        date: new Date(2016, cal.SEPTEMBER, 22),
        type: 'expense'
    }
];

test('september week 1', function(t) {
    t.plan(6);

    var start = new Date(2016, cal.SEPTEMBER, 1);
    var end = new Date(2016, cal.SEPTEMBER, 4);

    var summary = calendarAggregator.getSummary(start, end, budget, actual);
    t.equal(summary.budgetItems.length, 2, 'september week 1 budgeted income, expenses and actual expenses');
    t.equal(summary.budgeted, 1260 * 100, 'september week 1 budgeted net income');
    t.equal(summary.actualsForWeek.length, 2, 'september week 1 actual expenses.');
    t.equal(summary.actualsByBudget['food'], 100 * 100, 'september week 1 food actual');
    t.equal(summary.totalOverBudget, 25 * 100, 'september week 1 groceries over budget');
    t.equal(summary.net, 1235 * 100, 'september week 1 net income');

});

// I need something to make an expenditure after going negative.

test('september week 2', function(t) {
    t.plan(3);

    var start = new Date(2016, cal.SEPTEMBER, 4);
    var end = new Date(2016, cal.SEPTEMBER, 11);

    var summary = calendarAggregator.getSummary(start, end, budget, actual);
    t.equal(summary.budgetItems.length, 1, 'september week 2 transactions');
    t.equal(summary.budgeted, -75 * 100, 'september week 2 net income');
    t.equal(summary.actualsForWeek.length, 0, 'september week 2 actual expenses.');
});

test('september week 3', function(t) {
    t.plan(4);

    var start = new Date(2016, cal.SEPTEMBER, 11);
    var end = new Date(2016, cal.SEPTEMBER, 18);

    var summary = calendarAggregator.getSummary(start, end, budget, actual);
    t.equal(summary.budgetItems.length, 3, 'september week 3 budgeted income, expense and actual expenses');
    t.equal(summary.budgeted, 860 * 100, 'september week 3 net income');
    t.equal(summary.actualsForWeek.length, 1, 'september week 3 actual expenses.');
    t.equal(summary.actualsByBudget['food'], 50 * 100, 'september week 3 food actual expense');

});

test('september week 4', function(t) {
    t.plan(6);

    var start = new Date(2016, cal.SEPTEMBER, 18);
    var end = new Date(2016, cal.SEPTEMBER, 25);

    var summary = calendarAggregator.getSummary(start, end, budget, actual);

    t.equal(summary.budgetItems.length, 2, 'september week 4 budgeted income and expenses');
    t.equal(summary.budgeted, -175 * 100, 'september week 4 net income');
    t.equal(summary.actualsForWeek.length, 1, 'september week 4 actual expenses.');
    t.equal(summary.actualsUnbudgeted, 10 * 100, 'september week 4 actual expenses.');
    t.equal(summary.totalOverBudget, 0, 'september week 1 groceries over budget');
    t.equal(summary.net, -185 * 100, 'september net income');

});

test('september week 5', function(t) {
    t.plan(2);

    var start = new Date(2016, cal.SEPTEMBER, 25);
    var end = new Date(2016, cal.OCTOBER, 1);

    var summary = calendarAggregator.getSummary(start, end, budget, actual);
    t.equal(summary.budgetItems.length, 3, 'september week 5 transactions');
    t.equal(summary.budgeted, 710 * 100, 'september week 5 net income');

});

test('september total', function(t) {
    t.plan(6);

    var start = new Date(2016, cal.SEPTEMBER, 1);
    var end = new Date(2016, cal.OCTOBER, 1);

    var summary = calendarAggregator.getSummary(start, end, budget, actual);
    t.equal(summary.budgeted, 2580 * 100, 'september budgeted net income');
    t.equal(summary.actualsForWeek.length, 4, 'september actual expenses.');
    t.equal(summary.actualsByBudget['food'], 150 * 100, 'september food actual expense');
    t.equal(summary.actualsUnbudgeted, 10 * 100);
    t.equal(summary.totalOverBudget, 25 * 100, 'september total over budget');
    t.equal(summary.net, 2545 * 100, 'september net');

});
