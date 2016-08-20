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
            getAdjustedEndDate(endTime)
        );

        return diff / config.interval;
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