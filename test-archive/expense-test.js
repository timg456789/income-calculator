var test = require('tape');
var calc = require('./../calculator');
var data = require('./../data');

test('calculate recurring expenses for april, which has 5 full weeks, 2016', function(t) {
    t.plan(1);

    var timeRange = {
        startTime: data.aprilExpensesConfig.startTime,
        endTime: data.aprilExpensesConfig.endTime
    };

    var actual = calc.total(
        data.aprilExpensesConfig,
        timeRange);
    var expected = data.recurringExpensesApril2016;
    var msg = 'expenses for april 2016 are: ' + data.recurringExpensesApril2016;

    t.equal(actual, expected, msg);
});

test('calculate recurring expenses for may, which has 4 full weeks, 2016', function(t) {
    t.plan(1);

    var timeRange = {
        startTime: data.mayExpensesConfig.startTime,
        endTime: data.mayExpensesConfig.endTime
    };

    console.log('time range');
    console.log(timeRange);

    var actual = calc.total(
        data.mayExpensesConfig,
        timeRange
    );
    var msg = 'expenses for may 2016 are: ' + data.recurringExpensesMay2016
    
    t.equal(actual, data.recurringExpensesMay2016, msg);

});
