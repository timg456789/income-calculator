function NetIncomeCalculator() {

    const cal = require('./calendar');
    const UtcDay = require('./utc-day');
    const utcDay = new UtcDay();

    this.getBudget = function(config, startTime, endTime) {
        var breakdown = [];
        var mre = config.monthlyRecurringExpenses;
        var wre = config.weeklyRecurringExpenses;

        var current = new Date(startTime);
        while (current.getTime() < endTime) {
            getMonthlyExpenses(mre, current, breakdown);
            getWeeklyExpenses(wre, current, breakdown);
            getOneTimeExpenses(config.oneTimeExpenses, current, breakdown);
            getIncome(config.biWeeklyIncome.amount, current.getTime(), breakdown);

            current.setDate(current.getDate() + 1);
        }

        return breakdown;
    };

    function getMonthlyExpenses(monthlyExpenses, current, breakdown) {
        var mre = monthlyExpenses;
        for (var i = 0; i < mre.length; i++) {
            if ((current.getDate() == cal.SAFE_LAST_DAY_OF_MONTH && !mre[i].date) ||
                (mre[i].date && mre[i].date.getDate() === current.getDate())) {
                var processed = {};
                processed.name = mre[i].name;
                processed.amount = mre[i].amount;
                processed.date = new Date(current.getTime());
                processed.type = 'expense';
                breakdown.push(processed);
            }
        }

    }

    function getWeeklyExpenses(wre, current, breakdown) {
        if (current.getUTCDay() == cal.FRIDAY) {
            for (var i = 0; i < wre.length; i++) {
                var processed = {};
                processed.name = wre[i].name;
                processed.amount = wre[i].amount;
                processed.date = new Date(current.getTime());
                processed.endDate = new Date(current.getTime());
                processed.endDate.setDate(processed.endDate.getDate() + 7);
                processed.type = 'expense';
                breakdown.push(processed);
            }
        }
    }

    function getOneTimeExpenses(expenses, current, breakdown) {
        for (var i=0; i < expenses.length; i++) {
            var potentialOneTimeExpense = expenses[i];
            if (current.getTime() == potentialOneTimeExpense.date.getTime()) {
                var expense = {};
                expense.name = potentialOneTimeExpense.name;
                expense.amount = potentialOneTimeExpense.amount;
                expense.date = new Date(current.getTime());
                expense.type = 'expense';
                breakdown.push(expense);
            }
        }
    }

    function getIncome(amount, time, breakdown) {
        var incomeAccrual = getIncomeAccrual(amount, time);
        if (incomeAccrual) {
            breakdown.push(incomeAccrual);
        }
    }

    function getIncomeAccrual(amount, time) {
        var accrual;
        var diffFromFirstPayDate = utcDay.getDayDiff(
            cal.BIWEEKLY_PAY_START_DATE.getTime(),
            time
        );

        var modulusIntervalsFromFirstPayDate = diffFromFirstPayDate % cal.BIWEEKLY_INTERVAL;

        if (modulusIntervalsFromFirstPayDate === 0) {
            var accrual = {};
            accrual.name = 'biweekly income';
            accrual.amount = amount;
            accrual.date = new Date(time);
            accrual.type = 'income';
        }

        return accrual;
    }

}

module.exports = NetIncomeCalculator;