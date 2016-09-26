function HomeController() {

    var $ = require('jquery');
    var cal = require('income-calculator/src/calendar');
    const calendarView = require('./calendar-view');
    const homeView = require('./home-view');

    this.init = function (data) {
        $('#output').append('<p>Enter your biweekly income and expenses. Then we will show your expenses for the current month on a calendar.</p>');

        loadDateInput('#start-year', '#start-month');
        $('#start-month').val(new Date().getUTCMonth());
        homeView.setView(data);

        $('#load-budget').click(function () {
            $.getJSON($('#budget-url').val().trim(), {}, function (data) {
                homeView.setView(data);
            });
        });

        $('#project').click(function () {
            project();
        });
    };

    function project() {
        var budgetSettings = homeView.getModel();
        var year = parseInt($('#start-year').val().trim());
        var month = parseInt($('#start-month').val().trim());
        var start = new Date(Date.UTC(year, month, 1));
        var end = new Date(start.getTime());
        end.setUTCMonth(end.getUTCMonth() + 1);
        calendarView.build(year, month);
        calendarView.load(budgetSettings, budgetSettings.actuals, start, end);
        checkNet();
        $('#input-form').remove();
        $('#output').empty();
        /*$('#output').append('<p>You can view this budget at anytime by bookmarking this page and returning to the current URL.</p><div>I still have to do the create in S3 part and </div>');*/
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