var test = require('tape');

test('calculate expenses', function(t) {
    t.plan(1);

    var totalExpenses = 0;

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

    var expenses = [car, rent, carInsurance, utilities, phone];

    for(var i = 0; i < expenses.length; i++) {
        totalExpenses += expenses[i].amount;
    }

    totalExpenses += car.amount * 4; // car insurance is weekly.
    // it got added once with the monthly expenses.
    // now it gets complex, because weeks in a month are not constant like months in a year.
    // each week needs to get calculated, to see how many of the weekly expense dates occur in that month.
    // for now this is 5 total fridays for the month of april.
    // eventually i would expect 4 fridays.

    t.equal(1775.35, totalExpenses, 'total monthly expenses');
});

