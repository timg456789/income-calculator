var PayrollCalendar = require('./payroll-calendar');

exports.getThreePayCheckMonth = function (time, interval, payDay, firstPayDateTime) {

    var start = new Date(time);

    var config = {
        firstPayDateTime: firstPayDateTime,
        interval: interval
    };

    while(!monthHasThreePayChecks(start.getTime(), interval, payDay)) {
        var payrollCalendar = new PayrollCalendar(config);
        start = payrollCalendar.getNextDate(start.getTime());
    }

    return start;
};

exports.getExpenses = function (monthlyExpenses, weeklyExpenses, dayOfWeek, month, year) {
    var monthlyTotal = getSum(monthlyExpenses);

    var weeklyBillingPeriodsInMonth = getWeekDaysInMonth(
        dayOfWeek,
        month,
        year
    );

    var weeklyTotal = getSum(weeklyExpenses) * weeklyBillingPeriodsInMonth;
    return monthlyTotal + weeklyTotal;
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
