const $ = require('jquery');
const calendarView = require('./calendar-view');
const budgetParser = require('./budget-parser');
const cal = require('income-calculator/src/calendar');

const EXAMPLE_BUDGET = {
    monthlyRecurringExpenses: [
        { name: 'rent', amount: 550 * 100, date: new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH - 1) },
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

$(document).ready(function() {
    $('#config-input').val(JSON.stringify(EXAMPLE_BUDGET, 0, 4));
    $('#project').click(function () {
        project();
        $('#input-form').remove();
    });
});

function project() {

    var budgetSettings = budgetParser.parse($('#config-input').val());

    var start = new Date($('#start-date-input').val());
    var end = new Date($('#end-date-input').val());

    calendarView.build(start);
    calendarView.load(budgetSettings, actual, start, end);
}


