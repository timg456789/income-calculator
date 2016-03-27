
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

    var start = exports.getNextBiweeklyPayDateFrom(time, firstPayDateTime, interval);

    if (monthHasThreePayChecks(start.getTime(), interval, payDay)) {
        return start;
    } else {
        return exports.getThreePayCheckMonth(start.getTime(), interval, payDay, firstPayDateTime);
    }
    
};

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
