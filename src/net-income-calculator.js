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
            if (mre) {
                getMonthlyExpenses(mre, current, breakdown);
            }
            getWeeklyExpenses(wre, current, breakdown);
            if (config.oneTime) {
                getOne(config.oneTime, current, breakdown);
            }
            if (config.biWeeklyIncome) {
                getIncome(config.biWeeklyIncome.amount, current.getTime(), breakdown);
            }

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

    function matchesDefaultWeekly(transactionDate, current) {
        return cal.FRIDAY === current.getUTCDay() &&
            !transactionDate;
    }

    function matchesSpecifiedWeekly(transactionDate, currentDay) {
        return transactionDate &&
            currentDay === transactionDate.getUTCDay();
    }

    function getWeeklyExpenses(wre, current, breakdown) {
        var currentDay = current.getUTCDay();
        for (var i = 0; i < wre.length; i++) {
            if (matchesDefaultWeekly(wre[i].date, current) ||
                matchesSpecifiedWeekly(wre[i].date, currentDay)) {
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

    function getOne(expenses, current, breakdown) {
        for (var i=0; i < expenses.length; i++) {
            var potentialOneTimeExpense = expenses[i];
            if (current.getTime() == potentialOneTimeExpense.date.getTime()) {
                var expense = {};
                expense.name = potentialOneTimeExpense.name;
                expense.amount = potentialOneTimeExpense.amount;
                expense.date = new Date(current.getTime());
                expense.type = potentialOneTimeExpense.type;
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