
var calendar = require('./calendar.js');

function checkTime(time) {
    if (time < calendar.BIWEEKLY_PAY_START_DATE.getTime()) {
        throw "BiWeeklyPay period has not yet started.";
    }
}

exports.getNextBiweeklyPayDateFrom = function (startDateTime) {
    checkTime(startDateTime);

    var currentPayPeriod = new Date(calendar.BIWEEKLY_PAY_START_DATE.getTime());

    while (currentPayPeriod.getTime() <= startDateTime) {
        currentPayPeriod.setDate(currentPayPeriod.getDate() + calendar.BIWEEKLY_INTERVAL);
    }

    return currentPayPeriod;
}

exports.getThreePayCheckMonth = function (time, interval, payDay) {

    var start = exports.getNextBiweeklyPayDateFrom(time);

    if (monthHasThreePayChecks(start.getTime(), interval, payDay)) {
        return start;
    } else {
        return exports.getThreePayCheckMonth(start.getTime(), interval, payDay);
    }
    
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
