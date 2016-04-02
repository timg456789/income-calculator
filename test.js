var test = require('tape');
var calc = require('./calculator');
var cal = require ('./calendar');
var PayrollCalendar = require('./payroll-calendar');

test('Test start date limitations', function(t) {
    t.plan(1);
    var startDate = new Date(2016, 2, 17);

    var payrollCalendar = new PayrollCalendar({
        firstPayDateTime: cal.BIWEEKLY_PAY_START_DATE.getTime()
    });

    try {
        payrollCalendar.getNextBiweeklyPayDateFrom(
            startDate.getTime(),
            cal.BIWEEKLY_INTERVAL
        );

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

    var payrollCalendar = new PayrollCalendar({
        firstPayDateTime: cal.BIWEEKLY_PAY_START_DATE.getTime(),
        interval: cal.BIWEEKLY_INTERVAL
    });

    var tripleSecond = payrollCalendar.getNextBiweeklyPayDateFrom(
        tripleFirst.getTime());
    t.equal(tripleSecond.toString(), new Date(2016, cal.SEPTEMBER, 16).toString());

    var payrollCalendar = new PayrollCalendar({
        firstPayDateTime: cal.BIWEEKLY_PAY_START_DATE.getTime(),
        interval: cal.BIWEEKLY_INTERVAL
    });

    var tripleThird = payrollCalendar.getNextBiweeklyPayDateFrom(
        tripleSecond.getTime());

    t.equal(tripleThird.toString(), new Date(2016, cal.SEPTEMBER, 30).toString());

});

test('there are 366 days between january 1 2000 and january 1 2001', function(t) {
    t.plan(3);

    var startDate = new Date(2000, 0, 1);
    var endDate = new Date(2001, 0, 1);
    var dayDiff = calc.dayDiff(startDate.getTime(), endDate.getTime());
    
    t.equal(dayDiff, 366);
    t.equal(endDate.toString(), 'Mon Jan 01 2001 00:00:00 GMT-0500 (Eastern Standard Time)');
    t.equal(startDate.toString(), 'Sat Jan 01 2000 00:00:00 GMT-0500 (Eastern Standard Time)');

});

test('there are three paychecks between 04-01-2016 and 04-29-2016 on a biweekly interval', function(t) {
    t.plan(1);

    var startDate = new Date(2016, 3, 01);
    var endDate = new Date(2016, 3, 29);
    var payCheckCount = calc.getPayCheckCount(
        startDate.getTime(),
        endDate.getTime(),
        cal.BIWEEKLY_INTERVAL,
        cal.BIWEEKLY_PAY_START_DATE.getTime());

    t.equal(payCheckCount, 3);
});


test('4800 from 04-01-2016 and 04-29-2016', function(t) {
    t.plan(3);

    var rate = 1600;
    var startDate = new Date(2016, 3, 01);
    var endDate = new Date(2016, 3, 29);
    var biweeklyRecurringIncome = calc.getRecurringIncome(
        startDate.getTime(),
        endDate.getTime(),
        cal.BIWEEKLY_INTERVAL,
        rate,
        cal.BIWEEKLY_PAY_START_DATE.getTime());

    t.equal(startDate.toString(), 'Fri Apr 01 2016 00:00:00 GMT-0400 (Eastern Daylight Time)');
    t.equal(endDate.toString(), 'Fri Apr 29 2016 00:00:00 GMT-0400 (Eastern Daylight Time)');
    t.equal(biweeklyRecurringIncome, 4800);
});

test('4800 from 03-26-2016 and 04-30-2016', function(t) {
    t.plan(3);

    var rate = 1600;
    var startDate = new Date(2016, 2, 26);
    var endDate = new Date(2016, 3, 30);
    var biweeklyRecurringIncome = calc.getRecurringIncome(
        startDate.getTime(),
        endDate.getTime(),
        cal.BIWEEKLY_INTERVAL,
        rate,
        cal.BIWEEKLY_PAY_START_DATE.getTime());

    t.equal(startDate.toString(), 'Sat Mar 26 2016 00:00:00 GMT-0400 (Eastern Daylight Time)');
    t.equal(endDate.toString(), 'Sat Apr 30 2016 00:00:00 GMT-0400 (Eastern Daylight Time)');
    t.equal(biweeklyRecurringIncome, 4800);
});

test('node class', function(t) {
    t.plan(1);




    t.pass();
});



