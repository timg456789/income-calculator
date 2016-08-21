function MonthlyTotals() {

    this.getMonthlyTotals = function(weeklyTotals) {
        var monthlyTotals = [];
        var monthSummary = {};
        monthSummary.items = [];
        monthSummary.net = 0;

        var weekTotals;
        var weekTotalsIndex;

        var firstWeeksItem;

        var lastMonth = weeklyTotals[0].items[0].date.getMonth();
        var currentMonth;

        for (weekTotalsIndex = 0; weekTotalsIndex < weeklyTotals.length; weekTotalsIndex++) {
            weekTotals = weeklyTotals[weekTotalsIndex].items;
            firstWeeksItem = weekTotals[0];

            currentMonth = firstWeeksItem.date.getMonth();

            if (currentMonth !== lastMonth) {
                monthlyTotals.push(monthSummary);
                monthSummary = {};
                monthSummary.items = [];
                monthSummary.net = 0;
                lastMonth = currentMonth;
            }

            monthSummary.net += weeklyTotals[weekTotalsIndex].net;
            monthSummary.items.push(weekTotals);
        }

        monthlyTotals.push(monthSummary);

        return monthlyTotals;
    };

}

module.exports = MonthlyTotals;