var test = require('tape');
var calc = require('./../calculator');
var cal = require ('./../calendar');
var PayrollCalendar = require('./../payroll-calendar');
var data = require('./../data');

test('Test start date limitations', function(t) {
    t.plan(1);
    var startDate = new Date(2015, 2, 17);

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

    var calConfig = {
        firstPayDateTime: cal.BIWEEKLY_PAY_START_DATE.getTime(),
            interval: cal.BIWEEKLY_INTERVAL
    };

    var tripleFirst = calc.getThreePayCheckMonth(
        startDate.getTime(),
        cal.FRIDAY,
        calConfig);
    t.equal(tripleFirst.toString(), new Date(2016, cal.SEPTEMBER, 2).toString());

    var payrollCalendar = new PayrollCalendar({
        firstPayDateTime: cal.BIWEEKLY_PAY_START_DATE.getTime(),
        interval: cal.BIWEEKLY_INTERVAL
    });

    var tripleSecond = payrollCalendar.getNextDate(
        tripleFirst.getTime());
    t.equal(tripleSecond.toString(), new Date(2016, cal.SEPTEMBER, 16).toString());

    var tripleThird = payrollCalendar.getNextDate(
        tripleSecond.getTime());
    t.equal(tripleThird.toString(), new Date(2016, cal.SEPTEMBER, 30).toString());

});

test('4800 from 03-26-2016 and 04-30-2016', function(t) {
    t.plan(3);

    var payrollCalendar = new PayrollCalendar(cal.BIWEEKLY_CALENDAR_CONFIG);
    var biweeklyRecurringIncome = payrollCalendar.getRecurringIncome(
        {
            startTime: data.aprilIncomeConfig().startTime,
            endTime: data.aprilIncomeConfig().endTime
        },
        data.aprilIncomeConfig().rate
    );

    t.equal(new Date(data.aprilIncomeConfig().startTime).toString(), new Date(2016, cal.MARCH, 26).toString());
    t.equal(new Date(data.aprilIncomeConfig().endTime).toString(), new Date(2016, cal.APRIL, 30).toString());
    t.equal(biweeklyRecurringIncome, data.recurringIncomeApril2016);
});

test('3200 from 05-01-2016 and 05-31-2016', function(t) {
    t.plan(3);

    var payrollCalendar = new PayrollCalendar(cal.BIWEEKLY_CALENDAR_CONFIG);
    var biweeklyRecurringIncome = payrollCalendar.getRecurringIncome(
        {
            startTime: data.mayIncomeConfig().startTime,
            endTime: data.mayIncomeConfig().endTime
        },
        data.mayIncomeConfig().rate);

    t.equal(new Date(data.mayIncomeConfig().startTime).toString(), new Date(2016, cal.MAY, 1).toString());
    t.equal(new Date(data.mayIncomeConfig().endTime).toString(), new Date(2016, cal.MAY, 31).toString());
    t.equal(biweeklyRecurringIncome, data.recurringIncomeMay2016);
});
