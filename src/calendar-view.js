const $ = require('jquery');
const cal = require('income-calculator/src/calendar');

const NetIncomeCalculator = require('income-calculator/src/net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const CalendarAggregator = require('income-calculator/src/calendar-aggregator');
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
    return cal.MONTH_NAMES[date.getMonth()] +
            ' ' +
            date.getFullYear() +
            ': ' + '<span id="month-net-header-value"></span>';
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
    css = css.trim()
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

exports.build = function (year, month) {
    'use strict';
    var date = new Date(year, month);

    $('#months-container').empty();

    var monthContainerId = getMonthContainerId(date);

    $('#months-container').append(
        '<div class="month-heading">' + getMonthHeading(date) + '</div>' +
        '<div class="items-container-for-month" id="' +
            monthContainerId +
        '"></div>'
    );

    var monthTarget = '#' + monthContainerId;

    $(monthTarget).append('<div class="weeks row"></div>');

    var d;
    for (d = 0; d < 7; d += 1) {
        $(monthTarget + '>' + '.weeks').append(
            '<div class="day-col col-xs-1 week-name">' + cal.DAY_NAME_ABBRS[d] + '</div>');
    }

    $(monthTarget + '>' + '.weeks').append('<div class="day-col col-xs-1 week-name">Totals</div>');

    var currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());
    var transactionsForWeekTarget;
    var dayViewContainer;
    var dayInWeek;
    while (currentDate.getMonth() !== date.getMonth() + 1) {
        transactionsForWeekTarget = getWeekTarget(currentDate);
        dayViewContainer = ('<div class="transactions-for-week row ' + transactionsForWeekTarget + ' "></div>');
        $(monthTarget).append(dayViewContainer);

        for (dayInWeek = currentDate.getDay(); dayInWeek < 7; dayInWeek += 1) {
            $('.' + transactionsForWeekTarget).append(
                getDayView(currentDate, new Date().getUTCMonth() === currentDate.getUTCMonth()));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        $('.' + transactionsForWeekTarget).append(
            '<div class="day-view totals-view day-col col-xs-1">' +
            '</div>'
        );
    }

};

function loadTransactions(items, areActuals) {
    'use strict';
    var bi;
    var budgetItem;
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
    var budget = netIncomeCalculator.getBudget(
        budgetSettings,
        startTime,
        endTime
    );

    var summary = calendarAggregator.getSummary(
        startTime,
        endTime,
        budget,
        actual
    );

    return summary;
}

function loadWeeklyTotals(budgetSettings, actual, start) {
    'use strict';
    var weekEnd;
    var summary;
    var type;
    var currentBudgetDate = new Date(start);
    var currentTargetDate = new Date(start);
    var net = 0;

    while (currentTargetDate.getUTCMonth() !== start.getUTCMonth() + 1) {

        if (currentTargetDate.getUTCDay() !== 0) {
            currentTargetDate.setUTCDate(currentTargetDate.getUTCDate() - currentTargetDate.getUTCDay());
        }

        weekEnd = new Date(currentTargetDate.getTime());
        weekEnd.setUTCDate(weekEnd.getUTCDate() + cal.DAYS_IN_WEEK);

        if (weekEnd.getUTCMonth() > currentBudgetDate.getUTCMonth()) {
            weekEnd.setUTCDate(1);
        }

        summary = getSummary(
            budgetSettings,
            actual,
            currentBudgetDate.getTime(),
            weekEnd.getTime()
        );

        type = summary.net > 0
            ? 'income'
            : 'expense';

        $('.' + getWeekTarget(currentTargetDate) + ' .totals-view').append(
            getTransactionView('', summary.net, type)
        );

        net += summary.net;

        currentTargetDate.setTime(weekEnd.getTime());
        currentBudgetDate.setTime(weekEnd.getTime());
    }

    return net;
}

exports.load = function (budgetSettings, actual, start, end) {
    'use strict';
    $('#debug-console').append('<div>Showing from: ' + start.toISOString() + ' UTC</div>');
    $('#debug-console').append('<div>Until: ' + end.toISOString() + ' UTC</div>');

    var summary = getSummary(budgetSettings, actual, start.getTime(), end.getTime());

    loadTransactions(summary.budgetItems);
    loadTransactions(summary.actualsForWeek, true);

    $('#month-net-header-value').append(summary.net / 100);

    var netByWeeklyTotals = loadWeeklyTotals(budgetSettings, actual, start);

    $('#month-net-header-value').attr('data-net-by-weekly-totals', netByWeeklyTotals);
};
