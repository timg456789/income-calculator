function MonthlyTotals() {

    this.getMonthlyTotals = function(weeklyTotals) {
        var monthlyTotals = [];
        var monthSummary = {};
        monthSummary.items = [];
        monthSummary.net = 0;

        var weekSummary;
        var weekTotals;
        var weekTotalsIndex;

        var firstWeeksItem;

        var lastMonth = weeklyTotals[0].items[0].date.getMonth();
        var currentMonth;

        for (weekTotalsIndex = 0; weekTotalsIndex < weeklyTotals.length; weekTotalsIndex++) {
            weekSummary = weeklyTotals[weekTotalsIndex];
            firstWeeksItem = weekSummary.items[0];

            currentMonth = firstWeeksItem.date.getMonth();

            if (currentMonth !== lastMonth) {
                monthlyTotals.push(monthSummary);
                monthSummary = {};
                monthSummary.items = [];
                monthSummary.net = 0;
                lastMonth = currentMonth;
            }

            monthSummary.net += weekSummary.net;
            monthSummary.items.push(weekSummary);
        }

        monthlyTotals.push(monthSummary);

        return monthlyTotals;
    };

}

module.exports = MonthlyTotals;