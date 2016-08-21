function CalendarAggregator() {

    this.getWeekStartForMonth = function(time) {
        var date = new Date(time);
        var startWeekDate = date.getDate() - date.getDay();
        if (startWeekDate < 1) {
            startWeekDate = 1;
        }
        date.setDate(startWeekDate);
        return date;
    };

    this.getWeeklyTotals = function(breakdown) {
        var weeklyTotals = [];
        var i;

        var weekSummary = {};
        weekSummary.items = [];
        weekSummary.net = 0;

        var item;
        var lastStartWeek = this.getWeekStartForMonth(breakdown[0].date.getTime());
        var currentStartWeek;

        for (i = 0; i < breakdown.length; i++) {
            item = breakdown[i];
            currentStartWeek = this.getWeekStartForMonth(item.date.getTime());
            if (lastStartWeek.getDate() !== currentStartWeek.getDate()) {
                weeklyTotals.push(weekSummary);
                weekSummary = {};
                weekSummary.items = [];
                weekSummary.net = 0;
                lastStartWeek = currentStartWeek;
            }

            if (item.type === 'expense') {
                weekSummary.net -= item.amount;
            } else {
                weekSummary.net += item.amount;
            }

            weekSummary.items.push(item);
        }

        weeklyTotals.push(weekSummary);

        return weeklyTotals;
    };

}

module.exports = CalendarAggregator;
