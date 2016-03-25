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

    if (monthHasThreePayChecks(start.getTime())) {
        return start;
    } else {
        return exports.getThreePayCheckMonth(start.getTime());
    }
    
}

function monthHasThreePayChecks(time) {

    var hasThree = false;

    var first = new Date(time);
    var second = new Date(time);
    var third = new Date(time);

    var month = first.getMonth();

    second.setDate(first.getDate() + BIWEEKLY_INTERVAL);
    // This is going to fail on a leap year after looking through the calendar.
    // I knew it was too simple to start, but I didn't figure it out now until
    // looking at both the calendar and the code.
    third.setDate(first.getDate() + BIWEEKLY_INTERVAL * 2);

    if (first.getDay() === FRIDAY) {

        if (isDayOfMonth(second, month, FRIDAY)) {

            if (isDayOfMonth(third, month, FRIDAY)) {
                hasThree = true;
            }
        }
    }

    return hasThree;
}

function isDayOfMonth(date, month, day) {
    return date.getDay() === day &&
        date.getMonth() === month;
}
