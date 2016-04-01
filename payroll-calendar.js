function PayrollCallendar() {
    this.anything = 'something';

    function checkTime(time, firstPayDateTime) {
        if (time < firstPayDateTime) {
            throw "BiWeeklyPay period has not yet started.";
        }
    }

    this.getNextBiweeklyPayDateFrom = function (startDateTime, firstPayDateTime, interval) {
        checkTime(startDateTime, firstPayDateTime);

        var currentPayPeriod = new Date(firstPayDateTime);

        while (currentPayPeriod.getTime() <= startDateTime) {
            currentPayPeriod.setDate(currentPayPeriod.getDate() + interval);
        }
        return currentPayPeriod;
    };

}

module.exports = PayrollCallendar;