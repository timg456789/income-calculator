
function checkTime(time, firstPayDateTime) {
    if (time < firstPayDateTime) {
        throw "BiWeeklyPay period has not yet started.";
    }
}

exports.getNextBiweeklyPayDateFrom = function (startDateTime, firstPayDateTime, interval) {
    checkTime(startDateTime, firstPayDateTime);

    var currentPayPeriod = new Date(firstPayDateTime);

    while (currentPayPeriod.getTime() <= startDateTime) {
        currentPayPeriod.setDate(currentPayPeriod.getDate() + interval);
    }
    return currentPayPeriod;
};

exports.getThreePayCheckMonth = function (time, interval, payDay, firstPayDateTime) {

    var start = new Date(time);

    while(!monthHasThreePayChecks(start.getTime(), interval, payDay)) {
        start = exports.getNextBiweeklyPayDateFrom(start.getTime(), firstPayDateTime, interval);
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

    var payCheckCount = 0;
    var firstPayCheck = exports.getNextBiweeklyPayDateFrom(startTime - 1, firstPayDateTime, interval);

    if (firstPayCheck.getTime() === startTime) {
        payCheckCount += 1;
    }

    payCheckCount += exports.dayDiff(startTime, endTime) / interval;

    return payCheckCount;
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
