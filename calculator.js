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
    console.log("monthly expenses:" + monthlyTotal);

    var weeklyBillingPeriodsInMonth = getWeekDaysBetween(
        monthExpenseConfig.startTime,
        monthExpenseConfig.endTime,
        monthExpenseConfig.dayOfWeek
    );
    var oneWeekTotal = getSum(monthExpenseConfig.weeklyExpenses)
    console.log("expenses for one week: " + oneWeekTotal);

    var weeklyTotal = weeklyBillingPeriodsInMonth * oneWeekTotal;
    console.log("weekly expenses: " + weeklyTotal);

    return monthlyTotal + weeklyTotal;
}

exports.getNetIncome = function (incomeAndExpenses) {

    incomeAndExpenses.monthIncomeConfig.startTime = incomeAndExpenses.timeRange.startTime;
    incomeAndExpenses.monthIncomeConfig.endTime = incomeAndExpenses.timeRange.endTime;
    incomeAndExpenses.monthExpenseConfig.startTime = incomeAndExpenses.timeRange.startTime;
    incomeAndExpenses.monthExpenseConfig.endTime = incomeAndExpenses.timeRange.endTime;

    var payrollCalendar = new PayrollCalendar(incomeAndExpenses.monthIncomeConfig.calendarConfig);
    var grossIncome = payrollCalendar.getRecurringIncome(incomeAndExpenses.monthIncomeConfig);
    console.log("pay: " + grossIncome);

    var expenses = exports.total(incomeAndExpenses.monthExpenseConfig);
    expenses += getSum(incomeAndExpenses.oneTimeExpenses);
    console.log("expenses: " + expenses);

    var savings = getSum(incomeAndExpenses.savings);
    console.log("savings: " + savings);

    return grossIncome - expenses + savings;
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
