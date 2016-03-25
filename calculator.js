const BIWEEKLY_PAY_START_DATE = new Date(2016, 2, 18);
const FRIDAY = 5;
const BIWEEKLY_INTERVAL = 14;

function checkTime(time) {
    if (time < BIWEEKLY_PAY_START_DATE.getTime()) {
        throw "BiWeeklyPay period has not yet started.";
    }
}

exports.getNextBiweeklyPayDateFrom = function (startDateTime) {
    checkTime(startDateTime);

    var currentPayPeriod = new Date(BIWEEKLY_PAY_START_DATE.getTime());

    while (currentPayPeriod.getTime() <= startDateTime) {
        currentPayPeriod.setDate(currentPayPeriod.getDate() + BIWEEKLY_INTERVAL);
    }

    return currentPayPeriod;
}

exports.getThreePayCheckMonth = function (time) {

    var start = exports.getNextBiweeklyPayDateFrom(time);

    if (exports.monthHasThreePayChecks(start.getTime())) {
        return start;
    } else {
        return exports.getThreePayCheckMonth(start.getTime());
    }
    
}

exports.monthHasThreePayChecks = function (time) {

    var hasThree = false;

    var triple = new Date(time);

    if (triple.getDay() === FRIDAY) {

        var triplesMonth = triple.getMonth();
        triple.setDate(triple.getDate() + BIWEEKLY_INTERVAL);

        if (dateIsFridayInMonth(triple, triplesMonth)) {

            triple.setDate(triple.getDate() + BIWEEKLY_INTERVAL);

            if (dateIsFridayInMonth(triple, triplesMonth)) {
                hasThree = true;
            }
        }
    }

    return hasThree;
}

function dateIsFridayInMonth(date, month) {
    return date.getDay() === FRIDAY &&
        date.getMonth() === month;
}