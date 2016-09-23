const $ = require('jquery');
const cal = require('income-calculator/src/calendar');

const NetIncomeCalculator = require('income-calculator/src/net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const CalendarAggregator = require('income-calculator/src/calendar-aggregator');
const calendarAggregator = new CalendarAggregator();

function getTransactionView(name, amount, type, budget, isActual) {

    var budgetedCss = '';

    if (budget && budget.length > 0) {
        budgetedCss = 'budgeted';
    } else if (isActual) {
        budgetedCss = 'unbudgeted';
    }

    return '<div class="transaction-view ' +
        type + ' ' +
        budgetedCss + '">' +
        '<div class="name">' + name + '</div>' +
        '<div class="amount">$' + amount/100 + '</div>' +
        '</div>';
}

function getMonthContainerId(date) {
    return 'items-container-for-month-' +
        date.getFullYear() + '-' +
        date.getMonth();
}

function getMonthHeading(date) {
    return cal.MONTH_NAMES[date.getMonth()] +
        ' ' +
        date.getFullYear() +
        ': ' + '<span id="month-net-header-value"></span>';
}

function getDayView(date) {
    var dayViewHtml = '<div class="day-view day-col col-xs-1 ' +
        getDayTarget(date) + '">' +
        '</div>';
    return dayViewHtml;
}

function getDayTarget(date) {
    return 'day-of-' + getDateTarget(date);
}

function getWeekTarget(date) {
    return 'week-of-' + getDateTarget(date);;
}

function getDateTarget(date) {
    return date.getFullYear() + '-' +
    date.getMonth() + '-' +
    date.getDate();
}

exports.build = function (date) {

    $('#months-container').empty();

    var monthContainerId = getMonthContainerId(date);

    $('#months-container').append(
        '<div class="month-heading">' + getMonthHeading(date) + '</div>' +
        '<div class="items-container-for-month" id="' +
            monthContainerId +
        '"></div>');

    var monthTarget = '#' + monthContainerId;

    $(monthTarget).append('<div class="weeks row"></div>');

    for (var d = 0; d < 7; d++) {
        $(monthTarget + '>' + '.weeks').append(
            '<div class="day-col col-xs-1 week-name">' + cal.DAY_NAME_ABBRS[d] + '</div>');
    }

    $(monthTarget + '>' + '.weeks').append('<div class="day-col col-xs-1 week-name">Totals</div>');

    var currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    while (currentDate.getMonth() !== date.getMonth() + 1) {
        var dateClassName =  currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDate();

        var transactionsForWeekTarget = getWeekTarget(currentDate);
        var dayViewContainer = ('<div class="transactions-for-week row ' + transactionsForWeekTarget + ' "></div>');
        $(monthTarget).append(dayViewContainer);

        for (var dayInWeek = currentDate.getDay(); dayInWeek < 7; dayInWeek++) {
            $('.' + transactionsForWeekTarget).append(getDayView(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        $('.' + transactionsForWeekTarget).append(
            '<div class="day-view totals-view day-col col-xs-1">' +
            '</div>');
    }

};

function loadTransactions(items, areActuals) {
    for (var bi = 0; bi < items.length; bi++) {
        var budgetItem = items[bi];
        $('.' + getDayTarget(budgetItem.date)).append(
            getTransactionView(
                budgetItem.name, budgetItem.amount,
                budgetItem.type, budgetItem.budget,
                areActuals)
        );
    }
}

function loadWeeklyTotals(budgetSettings, actual, start) {

    var currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    while (currentDate.getMonth() !== start.getMonth() + 1) {
        var weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + cal.DAYS_IN_WEEK);

        var budget = netIncomeCalculator.getBudget(
            budgetSettings,
            currentDate.getTime(),
            weekEnd.getTime());

        $('#debug-console').append('<div>' + JSON.stringify(budget, 0, 4) + '</div>');


        var summary = calendarAggregator.getSummary(
            currentDate,
            weekEnd,
            budget,
            actual);

        var type = summary.net > 0 ? 'income' : 'expense';

        $('.' + getWeekTarget(currentDate) + ' .totals-view').append(
            getTransactionView('', summary.net, type)
        );

        currentDate.setDate(currentDate.getDate() + cal.DAYS_IN_WEEK);
    }
}

exports.load = function (budgetSettings, actual, start, end) {

    $('#debug-console').append('<div>' + start + '</div>');
    $('#debug-console').append('<div>' + end + '</div>');

    var budget = netIncomeCalculator.getBudget(
        budgetSettings,
        start.getTime(),
        end.getTime());

    var summary = calendarAggregator.getSummary(
        start,
        end,
        budget,
        actual);

    loadTransactions(summary.budgetItems);
    loadTransactions(summary.actualsForWeek, true);

    $('#month-net-header-value').append(summary.net/100);

    loadWeeklyTotals(budgetSettings, actual, start);
};
