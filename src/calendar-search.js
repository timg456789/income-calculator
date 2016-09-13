function CalendarSearch() {

    this.find = function (start, end, transactions) {
        var matches = [];

        for (i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (this.within(start, end, transaction.date)) {
                matches.push(transaction);
            }
        }

        return matches;
    };

    this.within = function (start, end, sample) {
        return sample.getTime() >= start.getTime() &&
            sample.getTime() < end.getTime();
    };

}

module.exports = CalendarSearch;