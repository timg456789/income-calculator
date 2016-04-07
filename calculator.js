var PayrollCalendar = require('./payroll-calendar');

exports.getThreePayCheckMonth = function (time, payDay, calConfig) {

    var start = new Date(time);

    while(!monthHasThreePayChecks(start.getTime(), calConfig.interval, payDay)) {
        var payrollCalendar = new PayrollCalendar(calConfig);
        start = payrollCalendar.getNextDate(start.getTime());
    }

    return start;
};

exports.total = function (monthExpenseConfig) {
    var monthlyTotal = getSum(monthExpenseConfig.monthlyExpenses);
    return monthlyTotal + getWeeklyExpenses(monthExpenseConfig);
}

exports.getNetIncome = function (monthExpenseConfig, monthIncomeConfig, oneTimeExpenses, timeRange) {

    monthIncomeConfig.startTime = timeRange.startTime;
    monthIncomeConfig.endTime = timeRange.endTime;
    monthExpenseConfig.startTime = timeRange.startTime;
    monthExpenseConfig.endTime = timeRange.endTime;

    var payrollCalendar = new PayrollCalendar(monthIncomeConfig.calendarConfig);
    var grossIncome = payrollCalendar.getRecurringIncome(monthIncomeConfig);

    var expenses = exports.total(monthExpenseConfig);
    expenses += getSum(oneTimeExpenses);

    return grossIncome - expenses;
}

function getWeeklyExpenses(monthExpenseConfig) {
    var weeklyBillingPeriodsInMonth = getWeekDaysBetween(monthExpenseConfig.startTime, monthExpenseConfig.endTime, monthExpenseConfig.dayOfWeek);
    var weeklyTotal = getSum(monthExpenseConfig.weeklyExpenses) * weeklyBillingPeriodsInMonth;
    return weeklyTotal
}

function getWeekDaysBetween(startTime, endTime, dayOfWeek) {

    var current = new Date(startTime);
    var endTime = new Date(endTime);

    var count = 0;
    var increment = 1;
    while (current.getTime() < endTime) {
        if (current.getDay() == dayOfWeek) {
            count += 1;
        }
        current.setDate(current.getDate() + increment);
    }

    return count;
}

function getSum(expenses) {
    var sum = 0;

    for(var i = 0; i < expenses.length; i++) {
        sum += expenses[i].amount;
    }

    return sum;
}

function monthHasThreePayChecks(time, interval, payDay) {

    var hasThree = false;

    var first = new Date(time);
    var second = new Date(time);
    var third = new Date(time);

    second.setDate(first.getDate() + interval);
    third.setDate(first.getDate() + interval * 2);

    if (first.getDay() === payDay &&
        second.getMonth() === first.getMonth() &&
            third.getMonth() === first.getMonth()) {
                hasThree = true;
    }

    return hasThree;
}
