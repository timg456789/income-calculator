function CalendarAggregator() {

    var that = this;

    this.getWeekStartForMonth = function(time) {
        var date = new Date(time);
        var startWeekDate = date.getDate() - date.getDay();
        if (startWeekDate < 1) {
            startWeekDate = 1;
        }
        date.setDate(startWeekDate);
        return date;
    };

    function createWeek(time) {
        var weekSummary = {};
        weekSummary.items = [];
        weekSummary.net = 0;
        weekSummary.date = that.getWeekStartForMonth(time);
        weekSummary.budgets = {};
        return weekSummary;
    };

    function getTransactionsUnderBudget(actual, item) {
        var transactions = [];
        for (var actualIndex = 0; actualIndex < actual.length; actualIndex++) {
            var actualTransaction = actual[actualIndex];

            if (item.name !== actualTransaction.budget) {
                continue;
            }

            if (actualTransaction.date.getTime() >= item.date.getTime() &&
                actualTransaction.date.getTime() < item.endDate.getTime()) {
                transactions.push(actualTransaction);
            }
        }

        return transactions;
    }

    this.getWeeklyTotals = function(breakdown, actual) {
        var weeklyTotals = [];
        var i;

        var item;
        var lastStartWeek = this.getWeekStartForMonth(breakdown[0].date.getTime());
        var weekSummary = createWeek(breakdown[0].date.getTime());
        var currentStartWeek;

        for (i = 0; i < breakdown.length; i++) {
            item = breakdown[i];
            currentStartWeek = this.getWeekStartForMonth(item.date.getTime());
            if (lastStartWeek.getDate() !== currentStartWeek.getDate()) {
                weeklyTotals.push(weekSummary);
                weekSummary = createWeek(currentStartWeek.getTime());
                lastStartWeek = currentStartWeek;
            }
            weekSummary.items.push(item);

            if (item.type === 'expense') {
                weekSummary.net -= item.amount;
            } else {
                weekSummary.net += item.amount;
            }

            if (!weekSummary.budgets[item.name]) {
                weekSummary.budgets[item.name] = item.amount;
            }

            var transactionsUnderBudget = getTransactionsUnderBudget(actual, item);
            if (transactionsUnderBudget.length > 0) {

                for (var budgetedTransactionIndex = 0; budgetedTransactionIndex < transactionsUnderBudget.length; budgetedTransactionIndex++) {
                    var budgetedTransaction = transactionsUnderBudget[budgetedTransactionIndex];

                    weekSummary.budgets[item.name] -= budgetedTransaction.amount;

                    if (weekSummary.budgets[item.name] < 0) {
                        var variance = budgetedTransaction.amount + weekSummary.budgets[item.name];
                        weekSummary.net -= variance;
                    }

                    weekSummary.items.push(budgetedTransaction);
                }
            }

        }

        weeklyTotals.push(weekSummary);

        return weeklyTotals;
    };

}

module.exports = CalendarAggregator;
