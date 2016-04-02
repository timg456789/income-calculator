function PayrollCallendar(config) {

    function checkTime(time) {
        if (time < config.firstPayDateTime) {
            throw "BiWeeklyPay period has not yet started.";
        }
    }

    this.getNextDate = function (startDateTime) {
        checkTime(startDateTime);

        var currentPayPeriod = new Date(config.firstPayDateTime);

        while (currentPayPeriod.getTime() <= startDateTime) {
            currentPayPeriod.setDate(currentPayPeriod.getDate() + config.interval);
        }
        return currentPayPeriod;
    };

    this.getPayCheckCount = function(startTime, endTime, interval, firstPayDateTime) {

        var adjustedStart = this.getNextDate(
            startTime - 1
        );
        adjustedStart.setDate(adjustedStart.getDate() - interval);

        var adjustedEnd = new Date(endTime);
        adjustedEnd.setDate(adjustedEnd.getDate() - interval);

        adjustedEnd = this.getNextDate(
            adjustedEnd.getTime()
        );

        var calc = require('./calculator');
        var dayDiff = calc.dayDiff(
            adjustedStart.getTime(),
            adjustedEnd.getTime()
        );

        return dayDiff / interval;
    }

}

module.exports = PayrollCallendar;