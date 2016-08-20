const UtcDay = require('./utc-day');

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

    this.getRecurringIncome = function(timeRange, rate) {
        var startTime = timeRange.startTime;
        var endTime = timeRange.endTime;

        var numberOfPaychecks = getCount(startTime, endTime);
        return numberOfPaychecks * rate;
    };

    function getCount(startTime, endTime) {
        var utcDay = new UtcDay();

        var diff = utcDay.getDayDiff(
            getAdjustedStartDate(startTime),
            endTime
        );

        var fullIntervals = Math.floor(diff / config.interval)

        return fullIntervals;
    }

    function getAdjustedStartDate(startTime) {
        var adjustedStart = that.getNextDate(startTime - 1);
        adjustedStart.setDate(adjustedStart.getDate() - config.interval);
        return adjustedStart;
    }

}

module.exports = PayrollCallendar;