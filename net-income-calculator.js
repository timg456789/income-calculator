function NetIncomeCalculator() {

    const cal = require('./calendar');
    const UtcDay = require('./utc-day');
    const CalendarIterator = require('./calendar-iterator');

    const utcDay = new UtcDay();
    const calendarIterator = new CalendarIterator();

    this.getBreakdown = function(config, startTime, endTime) {
        var breakdown = [];
        var mre = config.monthlyRecurringExpenses;
        var wre = config.weeklyRecurringExpenses;

        calendarIterator.iterateDaily(startTime, endTime, 1, function (current) {

            if (current.getDay() !== cal.FRIDAY) {
                return;
            }

            for (var i = 0; i < wre.length; i++) {
                breakdown.push(
                    getTransaction(wre[i].name, wre[i].amount, new Date(current), 'expense')
                );
            }

        });

        for (var i = 0; i < mre.length; i++) {

            calendarIterator.iterateMonthly(mre[i].date.getTime(), endTime, 1, function (current) {
                    breakdown.push(getTransaction(mre[i].name, mre[i].amount, new Date(current), 'expense'));
            });

        }

        var ote = config.oneTimeExpenses;
        for (var i=0; i < ote.length; i++) {
            calendarIterator.iterateDaily(startTime, endTime, 1, function (current) {
                if (current.getTime() == ote[i].dateIncurred.getTime()) {
                    breakdown.push(getTransaction(ote[i].name, ote[i].amount, new Date(current), 'expense'));
                }
            });
        }

        var biweeklyStartTime = new Date(startTime);
        var diffFromFirst = utcDay.getDayDiff(cal.BIWEEKLY_PAY_START_DATE.getTime(), startTime);
        biweeklyStartTime.setDate(biweeklyStartTime.getDate() - (diffFromFirst % cal.BIWEEKLY_INTERVAL) + cal.BIWEEKLY_INTERVAL);

        calendarIterator.iterateDaily(biweeklyStartTime.getTime(), endTime, cal.BIWEEKLY_INTERVAL, function (current) {
            breakdown.push(getTransaction('biweekly income', config.biWeeklyIncome.amount, new Date(current), 'income'));
        });

        return breakdown.sort(sort);
    };

    function sort (transactionA, transactionB) {
        var a = transactionA;
        var b = transactionB;
        if (a.date.getTime() !== b.date.getTime()) {
            return a.date.getTime() - b.date.getTime();
        }

        return a.type.localeCompare(b.type);
    }

    function getTransaction(name, amount, date, type) {
        var processed = {};

        processed.name = name;
        processed.amount = amount;
        processed.date = date;
        processed.type = type;

        return processed;
    }

}

module.exports = NetIncomeCalculator;