var test = require('tape');
var calc = require('./calculator');
var cal = require ('./calendar');

test('Test start date limitations', function(t) {
    t.plan(1);
    var startDate = new Date(2016, 2, 17);

    try {
        calc.getNextBiweeklyPayDateFrom(startDate.getTime(),
            cal.BIWEEKLY_PAY_START_DATE.getTime(),
            cal.BIWEEKLY_INTERVAL);
        t.ok(false);
    } catch(err) {
        t.equal(err, "BiWeeklyPay period has not yet started.");
    }
});

test('september 2016 is the next month with three paychecks from 04-29-2016', function(t) {
    t.plan(3);

    var startDate = new Date(2016, 3, 29);

    var tripleFirst = calc.getThreePayCheckMonth(
        startDate.getTime(),
        cal.BIWEEKLY_INTERVAL,
        cal.FRIDAY,
        cal.BIWEEKLY_PAY_START_DATE.getTime());
    t.equal(tripleFirst.toString(), new Date(2016, cal.SEPTEMBER, 2).toString());

    var tripleSecond = calc.getNextBiweeklyPayDateFrom(
        tripleFirst.getTime(),
        cal.BIWEEKLY_PAY_START_DATE.getTime(),
        cal.BIWEEKLY_INTERVAL);
    t.equal(tripleSecond.toString(), new Date(2016, cal.SEPTEMBER, 16).toString());

    var tripleThird = calc.getNextBiweeklyPayDateFrom(
        tripleSecond.getTime(),
        cal.BIWEEKLY_PAY_START_DATE.getTime(),
        cal.BIWEEKLY_INTERVAL);
    t.equal(tripleThird.toString(), new Date(2016, cal.SEPTEMBER, 30).toString());

});

//http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
test('how many days are there betweeon january 1 2000 and january 1 2001', function(t) {
    t.plan(3);

    var startDate = new Date(2000, 01, 01);
    t.equal(startDate.toString(), 'Sat Jan 01 2000 00:00:00 GMT-0400 (Eastern Daylight Time)');

    var endDate = new Date(2016, 3, 29);
    t.equal(endDate.toString(), 'Mon Jan 01 2001 00:00:00 GMT-0400 (Eastern Daylight Time)');

    var dayDiff = calc.dayDiff(startDate.getTime(), endDate.getTime());

    t.equal(dayDiff, 366);

    //var payCheckCount = calc.getPayCheckCountBetween(startTime, endTime);
    //t.equal(payCheckCount, 4);
});

test('there are 3 paychecks between 04-01-2016 and 04-29-2016', function(t) {
    t.plan(3);

    var startDate = new Date(2016, 3, 01);
    t.equal(startDate.toString(), 'Fri Apr 01 2016 00:00:00 GMT-0400 (Eastern Daylight Time)');

    var endDate = new Date(2016, 3, 29);
    t.equal(endDate.toString(), 'Fri Apr 29 2016 00:00:00 GMT-0400 (Eastern Daylight Time)');

    var dayDiff = calc.dayDiff(startDate.getTime(), endDate.getTime());

    t.equal(dayDiff, 29);

    //var payCheckCount = calc.getPayCheckCountBetween(startTime, endTime);
    //t.equal(payCheckCount, 4);
});