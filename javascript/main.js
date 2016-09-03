const EXAMPLE_BUDGET = [
    {
        "date": "2016-09-01T00:00:00.000Z",
        "items": [
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-02T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-09-02T00:00:00.000Z",
                        "type": "income"
                    }
                ],
                "net": 126000,
                "date": "2016-09-01T00:00:00.000Z"
            },
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-09T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": -7500,
                "date": "2016-09-04T00:00:00.000Z"
            },
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-16T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-09-16T00:00:00.000Z",
                        "type": "income"
                    },
                    {
                        "name": "taxes",
                        "amount": 40000,
                        "date": "2016-09-17T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": 86000,
                "date": "2016-09-11T00:00:00.000Z"
            },
            {
                "items": [
                    {
                        "name": "utilities",
                        "amount": 10000,
                        "date": "2016-09-20T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-23T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": -17500,
                "date": "2016-09-18T00:00:00.000Z"
            },
            {
                "items": [
                    {
                        "name": "rent",
                        "amount": 55000,
                        "date": "2016-09-28T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-30T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-09-30T00:00:00.000Z",
                        "type": "income"
                    }
                ],
                "net": 71000,
                "date": "2016-09-25T00:00:00.000Z"
            }
        ],
        "net": 258000
    },
    {
        "date": "2016-10-01T00:00:00.000Z",
        "items": [
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-10-07T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": -7500,
                "date": "2016-10-02T00:00:00.000Z"
            },
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-10-14T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-10-14T00:00:00.000Z",
                        "type": "income"
                    }
                ],
                "net": 126000,
                "date": "2016-10-09T00:00:00.000Z"
            },
            {
                "items": [
                    {
                        "name": "utilities",
                        "amount": 10000,
                        "date": "2016-10-20T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-10-21T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": -17500,
                "date": "2016-10-16T00:00:00.000Z"
            },
            {
                "items": [
                    {
                        "name": "rent",
                        "amount": 55000,
                        "date": "2016-10-28T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-10-28T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-10-28T00:00:00.000Z",
                        "type": "income"
                    }
                ],
                "net": 71000,
                "date": "2016-10-23T00:00:00.000Z"
            }
        ],
        "net": 172000
    }
];

$(document).ready(load);

const DAYS = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

function getTransactionView(name, amount, type) {
    return '<div class="transaction-view ' + type + '">' +
        '<div class="name">' + name + '</div>' +
        '<div class="amount">$' + amount/100 + '</div>' +
    '</div>';
}

function build() {
    var months = EXAMPLE_BUDGET.length;
    for (var monthIndex = 0; monthIndex < months; monthIndex++) {
        var month = EXAMPLE_BUDGET[monthIndex];
        month.date = new Date(month.date);

        var monthDescrip =
            month.date.getFullYear() +
            '-' +
            month.date.getMonth() +
            ' net: ' + month.net / 100;

        $('#months-container').append('<div class="month-heading">' + monthDescrip + '</div>' +
            '<div class="items-container-for-month" id="items-container-for-month-' + month.date.getMonth() + '"></div>');


        var monthTarget = '#items-container-for-month-' + month.date.getMonth();

        $(monthTarget).append('<div class="weeks row"></div>');

        for (var d = 0; d < 7; d++) {
            $(monthTarget + '>' + '.weeks').append('<div class="col-xs-1 week-name">' + DAYS[d] + '</div>');
        }

        $(monthTarget + '>' + '.weeks').append('<div class="col-xs-1 week-name">Totals</div>');

    }
}

function load() {
    build();
    var months = EXAMPLE_BUDGET.length;
    for (var monthIndex = 0; monthIndex < months; monthIndex++) {
        var month = EXAMPLE_BUDGET[monthIndex];
        month.date = new Date(month.date);

        var monthTarget = '#items-container-for-month-' + new Date(month.date).getMonth();

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
                $('.' + transactionsForWeekTarget).append('<div class="day-view col-xs-1 ' + transactionsForDayTarget + '"></div>');

                for (var transactionInWeek = 0; transactionInWeek < week.items.length; transactionInWeek++) {
                    var transaction = week.items[transactionInWeek];
                    transaction.date = new Date(transaction.date);

                    if (transaction.date.getDate() == currentDate.getDate()) {
                        $('.' + transactionsForDayTarget).append(getTransactionView(transaction.name, transaction.amount, transaction.type));
                    }

                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            $('.' + transactionsForWeekTarget).append('<div class="day-view col-xs-1">' +
                getTransactionView('', week.net) +
            '</div>');

        }
    }
}
