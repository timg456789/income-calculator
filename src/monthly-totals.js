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
        var weekTotalsIndex;

        var monthSummary = createMonth(weeklyTotals[0].items[0].date.getTime());
        var lastMonth = monthSummary.date.getMonth();

        var currentDate;

        for (weekTotalsIndex = 0; weekTotalsIndex < weeklyTotals.length; weekTotalsIndex++) {
            weekSummary = weeklyTotals[weekTotalsIndex];
            currentDate = weekSummary.items[0].date;

            if (currentDate.getMonth() !== lastMonth) {
                monthlyTotals.push(monthSummary);
                monthSummary = createMonth(currentDate.getTime());
                lastMonth = currentDate.getMonth();
            }

            monthSummary.net += weekSummary.net;
            monthSummary.items.push(weekSummary);
        }

        monthlyTotals.push(monthSummary);

        return monthlyTotals;
    };

}

module.exports = MonthlyTotals;