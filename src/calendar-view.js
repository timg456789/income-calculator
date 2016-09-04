const cal = require('income-calculator/calendar');

function getTransactionView(name, amount, type) {
    return '<div class="transaction-view ' + type + '">' +
        '<div class="name">' + name + '</div>' +
        '<div class="amount">$' + amount/100 + '</div>' +
        '</div>';
}

function getMonthContainerId(date) {
    return 'items-container-for-month-' +
        date.getFullYear() + '-' +
        date.getMonth();
}

function getMonthHeading(month) {
    return cal.MONTH_NAMES[month.date.getMonth()] +
        ' ' +
        month.date.getFullYear() +
        ': ' + month.net / 100;
}

exports.build = function (totalsForMonth) {

    $('#months-container').empty();

    var months = totalsForMonth.length;
    for (var monthIndex = 0; monthIndex < months; monthIndex++) {
        var month = totalsForMonth[monthIndex];
        month.date = new Date(month.date);

        var monthContainerId = getMonthContainerId(month.date);

        $('#months-container').append(
            '<div class="month-heading">' + getMonthHeading(month) + '</div>' +
            '<div class="items-container-for-month" id="' +
                monthContainerId +
            '"></div>');


        var monthTarget = '#' + monthContainerId;

        $(monthTarget).append('<div class="weeks row"></div>');

        for (var d = 0; d < 7; d++) {
            $(monthTarget + '>' + '.weeks').append(
                '<div class="day-col col-xs-1 week-name">' + cal.DAY_NAMES[d] + '</div>');
        }

        $(monthTarget + '>' + '.weeks').append('<div class="day-col col-xs-1 week-name">Totals</div>');

    }
}

exports.load = function (totalsForMonth) {
    var months = totalsForMonth.length;
    for (var monthIndex = 0; monthIndex < months; monthIndex++) {
        var month = totalsForMonth[monthIndex];
        month.date = new Date(month.date);

        var monthTarget = '#' + getMonthContainerId(new Date(month.date));

        for (var weekInMonth = 0; weekInMonth < month.items.length; weekInMonth++) {
            var week = month.items[weekInMonth];
            week.date = new Date(week.date);

            var dateClassName =  week.date.getFullYear() + '-' + week.date.getMonth() + '-' + week.date.getDate();

            var transactionsForWeekTarget = 'week-of-' + dateClassName;
            var dayViewContainer = ('<div class="transactions-for-week row ' + transactionsForWeekTarget + ' "></div>');
            $(monthTarget).append(dayViewContainer);

            var currentDate = new Date(week.date);
            currentDate.setDate(currentDate.getDate() - currentDate.getDay());

            for (var dayInWeek = currentDate.getDay(); dayInWeek < 7; dayInWeek++) {

                var transactionsForDayTarget = 'day-of-' + currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDate();
                $('.' + transactionsForWeekTarget).append('<div class="day-view day-col col-xs-1 ' + transactionsForDayTarget + '"></div>');

                for (var transactionInWeek = 0; transactionInWeek < week.items.length; transactionInWeek++) {
                    var transaction = week.items[transactionInWeek];
                    transaction.date = new Date(transaction.date);

                    if (transaction.date.getDate() == currentDate.getDate()) {
                        $('.' + transactionsForDayTarget).append(getTransactionView(transaction.name, transaction.amount, transaction.type));
                    }

                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            var transactionNetClass = week.net > 0 ? 'positive' : 'negative'

            $('.' + transactionsForWeekTarget).append('<div class="day-view day-col col-xs-1">' +
                getTransactionView('', week.net, 'net ' + transactionNetClass) +
                '</div>');

        }
    }

}