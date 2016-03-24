var test = require('tape');
var calc = require('./calculator');

test('Test start date limitations', function(t) {
    t.plan(1);
    var startDate = new Date(2016, 2, 17);

    try {
        calc.getNextBiweeklyPayDateFrom(startDate.getTime());
        t.ok(false);
    } catch(err) {
        t.equal(err, "BiWeeklyPay period has not yet started.");
    }
});

test('find the next pay period from 03-23-2016', function(t) {
    t.plan(3);
    var startDate = new Date(2016, 2, 23);

    var nextBiweeklyPayDate = calc.getNextBiweeklyPayDateFrom(startDate.getTime());

    t.equal(nextBiweeklyPayDate.getFullYear(), 2016);
    t.equal(nextBiweeklyPayDate.getMonth(), 3);
    t.equal(nextBiweeklyPayDate.getDate(), 1);
});

test('find the next pay period from 04-01-2016', function(t) {
    t.plan(3);
    var startDate = new Date(2016, 3, 1);

    var nextBiweeklyPayDate = calc.getNextBiweeklyPayDateFrom(startDate.getTime());

    t.equal(nextBiweeklyPayDate.getFullYear(), 2016);
    t.equal(nextBiweeklyPayDate.getMonth(), 3);
    t.equal(nextBiweeklyPayDate.getDate(), 15);
});

test('seek out the month with three paychecks', function(t) {
    t.plan(5);
    var startDate = new Date(2016, 2, 24);
    var triple = calc.getThreePayCheckMonth(startDate.getTime());

    t.equal(triple.getDay(), 5);

    var triplesMonth = triple.getMonth();

    triple.setDate(triple.getDate() + 14);

    t.equal(triple.getDay(), 5);
    t.equal(triple.getMonth(), triplesMonth);

    triple.setDate(triple.getDate() + 14);

    t.equal(triple.getDay(), 5);
    t.equal(triple.getMonth(), triplesMonth);

});
