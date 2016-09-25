const $ = require('jquery');
const calendarView = require('./calendar-view');
const budgetParser = require('./budget-parser');
const cal = require('income-calculator/src/calendar');
var HomeController = require('./home-controller');
var homeController = new HomeController();

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
    $('#project').click(function () {
        project();
        $('#input-form').remove();
    });
    homeController.init();
});

function project() {

    var budgetSettings = {};
    budgetSettings.monthlyRecurringExpenses = budgetParser.parse($('#monthly-input').val());
    budgetSettings.weeklyRecurringExpenses = budgetParser.parse($('#weekly-input').val());
    budgetSettings.oneTimeExpenses = budgetParser.parse($('#one-time-input').val());
    budgetSettings.biWeeklyIncome = {};
    budgetSettings.biWeeklyIncome.amount = parseInt($('#biweekly-input').val()) * 100;

    var year = parseInt($('#start-year').val());
    var month = parseInt($('#start-month').val());

    var start = new Date(Date.UTC(year, month, 1));
    var end = new Date(start.getTime());
    end.setMonth(end.getMonth() + 1);

    calendarView.build(year, month);
    calendarView.load(budgetSettings, actual, start, end);

    checkNet();
}

function checkNet() {
    var displayedNet = parseInt($('#month-net-header-value').html());
    var expectedNet = 2545;
    if (displayedNet !== expectedNet) {
        log('expected net of ' + expectedNet + ', but was: ' + displayedNet);
    }
}

function log(error) {
    console.log(error);
    $('#debug-console').append('<div>' + error + '</div>');
}