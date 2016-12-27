const test = require('tape');
const cal = require('../src/calendar');
const PayoffDateCalculator = require('../src/payoff-date-calculator');
const payoffDateCalculator = new PayoffDateCalculator();

test('payoff date test', function(t) {
    t.plan(1);

    var params = {};
    params.startTime = Date.UTC(2016, 11, 20);
    params.totalAmount = 6000;
    params.payment = 125;
    params.DayOfTheWeek = cal.FRIDAY;

    var expectedToAddEachYear = payoffDateCalculator.getPayoffDate(
        params
    );

    var expectedEndTime = Date.UTC(2017, cal.NOVEMBER, 17);
    t.equal(
        JSON.stringify(expectedToAddEachYear),
        JSON.stringify(new Date(expectedEndTime)),
        'weekly payment date (without considering interest)');

});

test('monthly interest', function(t) {
    t.plan(1);
    var balance = 5190.45;
    var apr = '.19720';
    var interest = payoffDateCalculator.getMonthlyInterest(balance, apr);
    t.equal(interest, 85.29639499999999);
});

test('weekly interest', function(t) {
    t.plan(1);
    var balance = 5190.45;
    var apr = '.19720';
    var interest = payoffDateCalculator.getWeeklyInterest(balance, apr);
    t.equal(interest, 19.6168221934742);
});

test('payoff date with monthly interest test', function(t) {
    t.plan(1);

    var params = {};
    params.startTime = Date.UTC(2016, 11, 20);
    params.totalAmount = 6000;
    params.payment = 125;
    params.DayOfTheWeek = cal.FRIDAY;
    params.rate = '.19720';

    var expectedToAddEachYear = payoffDateCalculator.getPayoffDate(
        params
    );

    var expectedEndTime = Date.UTC(2017, cal.DECEMBER, 29); // Damn, off by one week.
    t.equal(
        JSON.stringify(expectedToAddEachYear),
        JSON.stringify(new Date(expectedEndTime)),
        'weekly payment date (without considering interest)');

});
