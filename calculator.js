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

exports.getPayCheckCount = function(startTime, endTime, interval, firstPayDateTime) {

    var payrollCalendar = new PayrollCalendar({
        firstPayDateTime: firstPayDateTime,
        interval: interval
    });
    var adjustedStart = payrollCalendar.getNextDate(
        startTime - 1
    );
    adjustedStart.setDate(adjustedStart.getDate() - interval);

    var adjustedEnd = new Date(endTime);
    adjustedEnd.setDate(adjustedEnd.getDate() - interval);

    adjustedEnd = payrollCalendar.getNextDate(
        adjustedEnd.getTime()
    );
    
    var dayDiff = exports.dayDiff(
        adjustedStart.getTime(),
        adjustedEnd.getTime()
    );

    return dayDiff / interval;
}

exports.getRecurringIncome = function(
    startTime,
    endTime,
    interval,
    rate,
    firstPayDateTime) {

    var numberOfPaychecks = exports.getPayCheckCount(
        startTime,
        endTime,
        interval,
        firstPayDateTime);

    return numberOfPaychecks * rate;
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
