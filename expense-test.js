var test = require('tape');

test('calculate expenses', function(t) {
    t.plan(1);

    var car = {
        amount: 125
    };

    var rent = {
        amount: 550
    };

    var carInsurance = {
        amount: 335.35
    };

    var utilities = {
        amount: 165
    };

    var phone = {
        amount: 100
    };

    var monthlyExpenses = [rent, carInsurance, utilities, phone];
    var weeklyExpenses = [car];
    var recurringExpensesApril2016 = 1775.35;

    t.equal(getExpenses(monthlyExpenses, weeklyExpenses), recurringExpensesApril2016, 'expenses for april 2016 are: ' + recurringExpensesApril2016);
});

test('there are 5 fridays in april 2016', function(t) {
    t.plan(1);

    var calc = require('./calculator');
    var cal = require('./calendar');
    var numberOfFridays = calc.getWeekDaysInMonth(
        cal.FRIDAY,
        cal.APRIL,
        2016
    );

    t.equal(numberOfFridays, 5);
});

test('there are 4 fridays in may 2016', function(t) {
    t.plan(1);

    var calc = require('./calculator');
    var cal = require('./calendar');
    var numberOfFridays = calc.getWeekDaysInMonth(
        cal.FRIDAY,
        cal.MAY,
        2016
    );

    t.equal(numberOfFridays, 4);
});

function getExpenses(monthlyExpenses, weeklyExpenses) {
    var monthlyTotal = getSum(monthlyExpenses);
    var weeklyTotal = getSum(weeklyExpenses) * 5;
    return monthlyTotal + weeklyTotal;
}

function getSum(expenses) {
    var sum = 0;

    for(var i = 0; i < expenses.length; i++) {
        sum += expenses[i].amount;
    }

    return sum;
}
