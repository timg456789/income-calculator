function PayrollCallendar(config) {

    var that = this;

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
        var calc = require('./calculator');
        var dayDiff = calc.dayDiff(
            getAdjustedStartDate(startTime),
            getAdjustedEndDate(endTime)
        );
        return dayDiff / interval;
    }

    function getAdjustedStartDate(startTime) {
        var adjustedStart = that.getNextDate(startTime - 1);
        adjustedStart.setDate(adjustedStart.getDate() - config.interval);
        return adjustedStart;
    }

    function getAdjustedEndDate(endTime) {
        var adjustedEnd = new Date(endTime);
        adjustedEnd.setDate(adjustedEnd.getDate() - config.interval);
        adjustedEnd = that.getNextDate(adjustedEnd.getTime());
        return adjustedEnd;
    }

}

module.exports = PayrollCallendar;