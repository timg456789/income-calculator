function HomeController() {

    var $ = require('jquery');
    var cal = require('income-calculator/src/calendar');
    const calendarView = require('./calendar-view');
    const budgetParser = require('./budget-parser');
    const homeView = require('./home-view');

    this.init = function (data) {
        loadDateInput('#start-year', '#start-month');
        $('#start-month').val(new Date().getUTCMonth());
        homeView.setBudget(data);

        $('#load-budget').click(function () {
            $.getJSON($('#budget-url').val().trim(), {}, function (data) {
                homeView.setBudget(data);
            });
        });

        $('#project').click(function () {
            project();
        });
    };

    function project() {

        var budgetSettings = {};
        budgetSettings.monthlyRecurringExpenses = [];

        $('.monthly-expense-item').each(function() {
            var tran = {};

            var amountInput = $(this).children('input.amount');
            var dateInput = $(this).children('input.date');
            var nameInput = $(this).children('input.name');

            tran.amount = parseInt(amountInput.val().trim()) * 100;
            tran.date = new Date(dateInput.val().trim());
            tran.name = nameInput.val().trim();

            budgetSettings.monthlyRecurringExpenses.push(tran);
        });

        budgetSettings.weeklyRecurringExpenses = budgetParser.parse($('#weekly-input').val().trim());
        budgetSettings.oneTimeExpenses = budgetParser.parse($('#one-time-input').val().trim());
        budgetSettings.biWeeklyIncome = {};
        budgetSettings.biWeeklyIncome.amount = parseInt($('#biweekly-input').val().trim()) * 100;
        var year = parseInt($('#start-year').val().trim());
        var month = parseInt($('#start-month').val().trim());
        var start = new Date(Date.UTC(year, month, 1));
        var end = new Date(start.getTime());
        end.setUTCMonth(end.getUTCMonth() + 1);
        calendarView.build(year, month);
        calendarView.load(budgetSettings, budgetParser.parse($('#actuals').val().trim()), start, end);
        checkNet();
        $('#input-form').remove();
    }

    function loadDateInput(yearTarget, monthTarget) {
        loadYears(yearTarget);
        loadMonths(monthTarget);
    }

    function loadYears(target) {
        var startYear = new Date().getUTCFullYear();
        for (var year = startYear; year < startYear + 10; year++) {
            $(target).append('<option value="' + year + '">' + year + '</option>');
        }
    }

    function loadMonths(target) {
        for (var month = 0; month < cal.MONTHS_IN_YEAR; month++) {
            $(target).append(
                '<option value="' + month + '">' +
                cal.MONTH_NAME_ABBRS[month] +
                '</option>');
        }
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

}

module.exports = HomeController;