const BIWEEKLY_PAY_START_DATE = new Date(2016, 2, 18);

function checkTime(time) {
    if (time < BIWEEKLY_PAY_START_DATE.getTime()) {
        throw "BiWeeklyPay period has not yet started.";
    }
}

exports.getNextBiweeklyPayDateFrom = function (startDateTime) {
    checkTime(startDateTime);

    var currentPayPeriod = new Date(BIWEEKLY_PAY_START_DATE.getTime());

    while (currentPayPeriod.getTime() <= startDateTime) {
        currentPayPeriod.setDate(currentPayPeriod.getDate() + 14);
    }

    return currentPayPeriod;
}

exports.getThreePayCheckMonth = function (time) {
    var start = exports.getNextBiweeklyPayDateFrom(time);
    return start;
}