function CalendarSearch() {

    this.find = function (startTime, endTime, transactions) {
        var matches = [];

        for (i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (this.within(startTime, endTime, transaction.date.getTime())) {
                matches.push(transaction);
            }
        }

        return matches;
    };

    this.within = function (startTime, endTime, sampleTime) {
        return sampleTime >= startTime &&
            sampleTime < endTime;
    };

}

module.exports = CalendarSearch;