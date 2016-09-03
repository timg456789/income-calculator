function CalendarIterator() {

    this.iterateDaily = function (startTime, endTime, iterationDays, run) {
        var current = new Date(startTime);
        while (current.getTime() < endTime) {
            run(current);
            current.setDate(current.getDate() + iterationDays);
        }
    };

    this.iterateMonthly = function (startTime, endTime, iterationDays, run) {
        var current = new Date(startTime);
        while (current.getTime() < endTime) {
            run(current);
            current.setMonth(current.getMonth() + iterationDays);
        }
    };

}

module.exports = CalendarIterator;