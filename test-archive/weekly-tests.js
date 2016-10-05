const cal = require('../src/calendar');
const test = require('tape');

const NetIncomeCalculator = require('../src/net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const CalendarAggregator = require('../src/calendar-aggregator');
const calendarAggregator = new CalendarAggregator();

test('september week 1', function (t) {
    t.plan(5);

    const start = Date.UTC(2016, cal.OCTOBER, 2);
    const end = Date.UTC(2016, cal.OCTOBER, 9);

    var budgetSettings = {
        weeklyRecurringExpenses: [
            {name: 'food', amount: 7550, date: new Date(Date.UTC(2016, cal.OCTOBER, 2))}
        ]
    };

    var actual = [
        {
            name: 'groceries',
            amount: 7551,
            date: new Date(Date.UTC(2016, cal.OCTOBER, 3)),
            type: 'expense',
            budget: 'food'
        }
    ];

    var budget = netIncomeCalculator.getBudget(
        budgetSettings,
        start,
        end
    );

    var summary = calendarAggregator.getSummary(start, end, budget, actual);
    t.equal(summary.budgetItems.length, 1, 'budget is one expense');
    t.equal(summary.budgetedNet, -7550, 'weekly budgeted net');
    t.equal(7551, summary.actualsByBudget.food, 'actual spent on food');
    t.equal(1, summary.totalOverBudget, 'weekly overage on food budget by one cent.');
    t.equal(summary.net, -7551, 'weekly expense net');
});