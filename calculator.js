const BIWEEKLY_PAY_START_DATE = new Date(2016, 2, 18);

exports.getNextBiweeklyPayDateFrom = function (startDateTime) {

    if (startDateTime < BIWEEKLY_PAY_START_DATE.getTime()) {
        throw "BiWeeklyPay period has not yet started.";
    }

    var currentPayPeriod = new Date(BIWEEKLY_PAY_START_DATE.getTime());

    while (currentPayPeriod.getTime() <= startDateTime) {
        currentPayPeriod.setDate(currentPayPeriod.getDate() + 14);
    }

    return currentPayPeriod;
}
