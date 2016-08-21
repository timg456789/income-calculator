function CalendarAggregator() {

    this.getWeeklyTotals = function(breakdown) {
        var weeklyTotals = [];
        var i;
        var week;
        var item;

        for (i = 0; i < breakdown.length; i++) {
            week = [];

            item = breakdown[i];
            console.log(item);

            weeklyTotals.push(week);
        }

        return weeklyTotals;
    };

}

module.exports = CalendarAggregator;