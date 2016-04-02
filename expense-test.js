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

    var weeklyExpenses = [car];
    var monthlyExpenses = [rent, carInsurance, utilities, phone];

    var monthlyTotal = getSum(monthlyExpenses);
    var weeklyTotal = getSum(weeklyExpenses) * 5;

    var projectedExpenses = monthlyTotal + weeklyTotal;
    var recurringExpensesApril2016 = 1775.35;

    t.equal(projectedExpenses, recurringExpensesApril2016, 'expenses for april 2016 are: ' + recurringExpensesApril2016);
});

function getSum(expenses) {
    var sum = 0;

    for(var i = 0; i < expenses.length; i++) {
        sum += expenses[i].amount;
    }

    return sum;
}
