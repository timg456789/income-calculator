function MonthlyTotals() {

    function createMonth(time) {
        var monthSummary = {};
        monthSummary.date = new Date(time);
        monthSummary.date.setDate(1);
        monthSummary.items = [];
        monthSummary.net = 0;
        return monthSummary;
    }

    this.getMonthlyTotals = function(weeklyTotals) {
        var monthlyTotals = [];

        var weekSummary;
        var weekTotals;
        var weekTotalsIndex;

        var firstWeeksItem;
        var lastMonth = weeklyTotals[0].items[0].date.getMonth();
        var currentMonth;
        var monthSummary = createMonth(weeklyTotals[0].items[0].date.getTime());

        for (weekTotalsIndex = 0; weekTotalsIndex < weeklyTotals.length; weekTotalsIndex++) {
            weekSummary = weeklyTotals[weekTotalsIndex];
            firstWeeksItem = weekSummary.items[0];

            currentMonth = firstWeeksItem.date.getMonth();

            if (currentMonth !== lastMonth) {

                monthlyTotals.push(monthSummary);

                monthSummary = createMonth(firstWeeksItem.date.getTime());
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