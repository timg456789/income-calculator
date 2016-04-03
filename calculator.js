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

exports.getNetIncome = function (monthExpenseConfig, payrollCalendarConfig, monthIncomeConfig) {

    var payrollCalendar = new PayrollCalendar(payrollCalendarConfig);
    var expenses = exports.total(monthExpenseConfig);
    var grossIncome = payrollCalendar.getRecurringIncome(monthIncomeConfig);

    return grossIncome - expenses;
}

function getWeeklyExpenses(monthExpenseConfig) {
    var weeklyBillingPeriodsInMonth = getWeekDaysInMonth(
        monthExpenseConfig.dayOfWeek,
        monthExpenseConfig.month,
        monthExpenseConfig.year
    );

    var weeklyTotal = getSum(monthExpenseConfig.weeklyExpenses) * weeklyBillingPeriodsInMonth;

    return weeklyTotal
}

function getWeekDaysInMonth(dayOfWeek, month, year) {

    var current = new Date(year, month, 1);

    var count = 0;

    while (current.getMonth() <= month) {
        if (current.getDay() == dayOfWeek) {
            count += 1;
        }
        current.setDate(current.getDate() + 1);
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
