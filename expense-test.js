var test = require('tape');
var calc = require('./calculator');
var cal = require('./calendar');
var data = require('./data');

test('calculate recurring expenses for april 2016', function(t) {
    t.plan(1);

    var recurringExpensesApril2016 = 1775.35;
    var actual = calc.getExpenses(
        data.monthlyExpenses,
        data.weeklyExpenses,
        cal.FRIDAY,
        cal.APRIL,
        2016
    );

    t.equal(
        actual,
        recurringExpensesApril2016,
        'expenses for april 2016 are: ' + recurringExpensesApril2016
    );
});

test('calculate recurring expenses for may 2016', function(t) {
    t.plan(1);

    var expected = 1650.35;
    var actual = calc.getExpenses(
        data.monthlyExpenses,
        data.weeklyExpenses,
        cal.FRIDAY,
        cal.MAY,
        2016);

    t.equal(
        actual,
        expected,
        'expenses for may 2016 are: ' + expected
    );

});
