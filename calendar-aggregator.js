function CalendarAggregator() {

    function getWeekStartForMonth(time) {
        var date = new Date(time);
        var startWeekDate = date.getDate() - date.getDay();
        if (startWeekDate < 1) {
            startWeekDate = 1;
        }
        date.setDate(startWeekDate)
        return date;
    }

    this.getWeeklyTotals = function(breakdown) {
        var weeklyTotals = [];
        var i;
        var week = [];
        var item;
        var lastStartWeek = getWeekStartForMonth(breakdown[0].date.getTime());
        var currentStartWeek;

        for (i = 0; i < breakdown.length; i++) {
            item = breakdown[i];
            currentStartWeek = getWeekStartForMonth(item.date.getTime());
            if (lastStartWeek.getDate() !== currentStartWeek.getDate()) {
                weeklyTotals.push(week);
                week = [];
                lastStartWeek = currentStartWeek;
            }

            week.push(item);
        }

        weeklyTotals.push(week);

        return weeklyTotals;
    };

    this.getMonthlyTotals = function(weeklyTotals) {
        var monthlyTotals = [];

        return monthlyTotals;
    };

}

module.exports = CalendarAggregator;