var test = require('tape');
var calc = require('./calculator');
var data = require('./data');

test('calculate recurring expenses for april 2016', function(t) {
    t.plan(1);

    var actual = calc.getExpenses(data.aprilExpensesConfig);
    var expected = data.recurringExpensesApril2016;
    var msg = 'expenses for april 2016 are: ' + data.recurringExpensesApril2016;

    t.equal(actual, expected, msg);
});

test('calculate recurring expenses for may 2016', function(t) {
    t.plan(1);

    var expected = 1650.35;
    var actual = calc.getExpenses(data.mayExpensesConfig);

    t.equal(actual, expected, 'expenses for may 2016 are: ' + expected);

});
