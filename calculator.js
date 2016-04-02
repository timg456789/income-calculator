var PayrollCalendar = require('./payroll-calendar');

exports.getThreePayCheckMonth = function (time, interval, payDay, firstPayDateTime) {

    var start = new Date(time);

    var config = {
        firstPayDateTime: firstPayDateTime,
        interval: interval
    };

    while(!monthHasThreePayChecks(start.getTime(), interval, payDay)) {
        var payrollCalendar = new PayrollCalendar(config);
        start = payrollCalendar.getNextDate(start.getTime());
    }

    return start;
};

exports.dayDiff = function (startTime, endTime) {
    var start = new Date(startTime);
    var end = new Date(endTime);
    var diff = 0;

    while (start.getTime() < end.getTime()) {
        diff += 1;
        start.setDate(start.getDate() + 1);
    }

    return diff;
}

exports.getRecurringIncome = function(
    startTime,
    endTime,
    interval,
    rate,
    firstPayDateTime) {

    var payrollCalendar = new PayrollCalendar({
        firstPayDateTime: firstPayDateTime,
        interval: interval
    });

    var numberOfPaychecks = payrollCalendar.getPayCheckCount(
        startTime,
        endTime);

    return numberOfPaychecks * rate;
}

exports.getWeekDaysInMonth = function(dayOfWeek, month, year) {

    var current = new Date(year, month, 1);

    var count = 0;

    while (current.getMonth() <= month) {
        if (current.getDay() == dayOfWeek) {
            count += 1;
        }
        current.setDate(current.getDate() + 1);
    }

    return count;
}

function monthHasThreePayChecks(time, interval, payDay) {

    var hasThree = false;

    var first = new Date(time);
    var second = new Date(time);
    var third = new Date(time);

    second.setDate(first.getDate() + interval);
    third.setDate(first.getDate() + interval * 2);

    if (first.getDay() === payDay &&
        second.getMonth() === first.getMonth() &&
            third.getMonth() === first.getMonth()) {
                hasThree = true;
    }

    return hasThree;
}
