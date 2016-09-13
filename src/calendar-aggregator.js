function CalendarAggregator() {

    const calendar = require('./calendar');

    const CalendarSearch = require('./calendar-search');
    const calendarSearch = new CalendarSearch();

    this.getSummary = function (start, end, budget, actual) {
        var summary = {};

        summary.budgetItems = calendarSearch.find(start, end, budget);
        summary.budgeted = getSimpleTotal(summary.budgetItems);
        summary.actualsForWeek = calendarSearch.find(start, end, actual);
        summary.actualsByBudget = getTotalAmountsByBudget(summary.actualsForWeek);
        summary.actualsUnbudgeted = getTotalAmountUnbudgeted(summary.actualsForWeek);
        summary.totalOverBudget = getAmountOverBudget(summary.budgetItems, summary.actualsForWeek);
        summary.net = getNet(summary.budgeted, summary.totalOverBudget, summary.actualsUnbudgeted);

        return summary;
    };

    function getTotalAmountsByBudget(transactions) {
        var amounts = [];

        for (var i = 0; i < transactions.length; i++) {
            var t = transactions[i];
            if (!amounts[t.budget]) {
                amounts[t.budget] = 0;
            }

            amounts[t.budget] += t.amount;
        }

        return amounts;
    };

    function getTotalAmountUnbudgeted(transactions) {
        var total = 0;

        for (var i = 0; i < transactions.length; i++) {
            var t = transactions[i];
            if (!t.budget) {
                total += t.amount;
            }
        }

        return total;
    }

    function getSimpleTotal(budget) {
        var net = 0;
        var item;

        for (var i = 0; i < budget.length; i++) {
            var item = budget[i];
            if (item.type === 'expense') {
                net -= item.amount;
            } else {
                net += item.amount;
            }
        }

        return net;
    };

    function getNet(budgeted, totalOverBudget, unbudgeted) {
        return budgeted - totalOverBudget - unbudgeted;
    };

    function getAmountOverBudget(budget, actuals) {
        var total = 0;

        for (var bI = 0; bI < budget.length; bI++) {
            var budgetBalance = budget[bI].amount;
            for (var aI = 0; aI < actuals.length; aI++) {

                if (actuals[aI].budget === budget[bI].name &&
                    calendarSearch.within(budget[bI].date, budget[bI].endDate, actuals[aI].date)) {
                    budgetBalance -= actuals[aI].amount;
                }

                if (aI === actuals.length - 1) {
                    if (budgetBalance < 0) {
                        total += budgetBalance * -1;
                    }
                }
            }
        }

        return total;
    };

}

module.exports = CalendarAggregator;
