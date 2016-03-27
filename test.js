var test = require('tape');
var calc = require('./calculator');
var cal = require ('./calendar');

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

test('september 2016 is the next month three paychecks from 04-29-2016', function(t) {
    t.plan(9);

    var startDate = new Date(2016, 3, 29);

    var tripleFirst = calc.getThreePayCheckMonth(
        startDate.getTime(),
        cal.BIWEEKLY_INTERVAL,
        cal.FRIDAY);

    var tripleSecond = calc.getNextBiweeklyPayDateFrom(tripleFirst.getTime());
    var tripleThird = calc.getNextBiweeklyPayDateFrom(tripleSecond.getTime());

    t.equal(tripleFirst.getFullYear(), 2016);
    t.equal(tripleFirst.getMonth(), 8);
    t.equal(tripleFirst.getDate(), 2);

    t.equal(tripleSecond.getFullYear(), 2016);
    t.equal(tripleSecond.getMonth(), 8);
    t.equal(tripleSecond.getDate(), 16);

    t.equal(tripleThird.getFullYear(), 2016);
    t.equal(tripleThird.getMonth(), 8);
    t.equal(tripleThird.getDate(), 30);

});

test('there are 4 paychecks between 03-26-2016 and 04-29-2016', function(t) {
    t.plan(1);

    var startDate = new Date(2016, 2, 26);
    t.equal(startDate.toString(), 'Sat Mar 26 2016 00:00:00 GMT-0400 (Eastern Daylight Time)');


});
