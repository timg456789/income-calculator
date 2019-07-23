const cal = require('./calculators/calendar');
const CalendarCalculator = require('./calendar-calculator');
const Util = require('./util');
const calCalc = new CalendarCalculator();
const Currency = require('currency.js');
const NetIncomeCalculator = require('./calculators/net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const CalendarAggregator = require('./calculators/calendar-aggregator');
const calendarAggregator = new CalendarAggregator();

function getTransactionView(name, amount, type, budget, isActual) {
    'use strict';

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
            '<div class="amount">$' + amount / 100 + '</div>' +
            '</div>';
}

function getMonthContainerId(date) {
    'use strict';
    return 'items-container-for-month-' +
            date.getFullYear() + '-' +
            date.getMonth();
}

function getMonthHeading(date) {
    'use strict';
    return `Net for ${cal.MONTH_NAMES[date.getUTCMonth()]} ${date.getFullYear()} <span id="month-net-header-value"></span>`;
}

function getDateTarget(date) {
    'use strict';
    return date.getUTCFullYear() + '-' +
            date.getUTCMonth() + '-' +
            date.getUTCDate();
}

function getDayTarget(date) {
    'use strict';
    return 'day-of-' + getDateTarget(date);
}

function getDayView(date, inMonth) {
    'use strict';
    var css = !inMonth
        ? 'out-of-month'
        : '';
    css += ' day-view'
    css = css.trim();
    var dayViewHtml = '<div class="' + css + ' day-col col-xs-1 ' +
            getDayTarget(date) + '">' +
            '<span class="calendar-day-number">' +
            date.getUTCDate() + '</div>';
    return dayViewHtml;
}

function getWeekTarget(date) {
    'use strict';
    return 'week-of-' + getDateTarget(date);
}

function addMonthContainer(monthContainerId, date) {
    $('#months-container').append(
        '<div class="month-heading">' + getMonthHeading(date) + '</div>' +
        '<div class="items-container-for-month" id="' +
        monthContainerId +
        '"></div>'
    );
}

function addWeekAbbreviationHeaders(monthTarget) {
    var d;
    for (d = 0; d < 7; d += 1) {
        $(monthTarget + '>' + '.weeks').append(
            '<div class="day-col col-xs-1 week-name">' + cal.DAY_NAME_ABBRS[d] + '</div>');
    }
}

function addMonth(year, month) {
    var date = calCalc.createByMonth(year, month);
    $('#months-container').empty();
    var monthContainerId = getMonthContainerId(date);
    addMonthContainer(monthContainerId, date);

    var monthTarget = '#' + monthContainerId;
    $(monthTarget).append('<div class="weeks row"></div>');
    addWeekAbbreviationHeaders(monthTarget);

    return monthContainerId;
}

exports.build = function (year, month) {
    'use strict';

    let monthContainerId = addMonth(year, month);
    let dayViewContainer;
    let transactionsForWeekTarget;
    calCalc.getMonthAdjustedByWeek(
        year,
        month,
        function (currentDate) {
            var dayView = getDayView(currentDate, new Date().getUTCMonth() === currentDate.getUTCMonth());
            $('.' + transactionsForWeekTarget).append(dayView);
        },
        function (currentDate) {
            transactionsForWeekTarget = getWeekTarget(currentDate);
            dayViewContainer = ('<div class="transactions-for-week row ' + transactionsForWeekTarget + ' "></div>');
            var monthTarget = '#' + monthContainerId;
            $(monthTarget).append(dayViewContainer);
        });
};

function loadTransactions(items, areActuals) {
    'use strict';
    let bi;
    let budgetItem;
    for (bi = 0; bi < items.length; bi += 1) {
        budgetItem = items[bi];
        $('.' + getDayTarget(budgetItem.date)).append(
            getTransactionView(
                budgetItem.name,
                budgetItem.amount,
                budgetItem.type,
                budgetItem.budget,
                areActuals
            )
        );
    }
}

function getSummary(budgetSettings, actual, startTime, endTime) {
    'use strict';
    let budget = netIncomeCalculator.getBudget(
        budgetSettings,
        startTime,
        endTime
    );
    let summary = calendarAggregator.getSummary(
        startTime,
        endTime,
        budget,
        actual
    );
    return summary;
}

exports.load = function (budgetSettings, actual, start, end) {
    'use strict';
    $('#debug-console').append('<div>Showing from: ' + start.toISOString() + ' UTC</div>');
    $('#debug-console').append('<div>Until: ' + end.toISOString() + ' UTC</div>');

    let summary = getSummary(budgetSettings, actual, start.getTime(), end.getTime());

    loadTransactions(summary.budgetItems);
    let netDollars = Currency(summary.net).divide(100).toString();
    let netDollarsFormatted = Util.format(netDollars);
    $('#month-net-header-value').append(netDollarsFormatted);
};
