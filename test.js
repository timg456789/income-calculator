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
        payrollCalendar.getNextDate(
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

    var tripleSecond = payrollCalendar.getNextDate(
        tripleFirst.getTime());
    t.equal(tripleSecond.toString(), new Date(2016, cal.SEPTEMBER, 16).toString());

    var payrollCalendar = new PayrollCalendar({
        firstPayDateTime: cal.BIWEEKLY_PAY_START_DATE.getTime(),
        interval: cal.BIWEEKLY_INTERVAL
    });

    var tripleThird = payrollCalendar.getNextDate(
        tripleSecond.getTime());

    t.equal(tripleThird.toString(), new Date(2016, cal.SEPTEMBER, 30).toString());

});

test('4800 from 03-26-2016 and 04-30-2016', function(t) {
    t.plan(3);

    var rate = 1600;
    var startDate = new Date(2016, 2, 26);
    var endDate = new Date(2016, 3, 30);

    var payrollCalendar = new PayrollCalendar({
        firstPayDateTime: cal.BIWEEKLY_PAY_START_DATE.getTime(),
        interval: cal.BIWEEKLY_INTERVAL
    });
    var biweeklyRecurringIncome = payrollCalendar.getRecurringIncome(
        startDate.getTime(),
        endDate.getTime(),
        rate);

    t.equal(startDate.toString(), 'Sat Mar 26 2016 00:00:00 GMT-0400 (Eastern Daylight Time)');
    t.equal(endDate.toString(), 'Sat Apr 30 2016 00:00:00 GMT-0400 (Eastern Daylight Time)');
    t.equal(biweeklyRecurringIncome, 4800);
});