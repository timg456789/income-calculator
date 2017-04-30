const test = require('tape');
const cal = require('../src/calendar');
const PayoffDateCalculator = require('../src/payoff-date-calculator');
const payoffDateCalculator = new PayoffDateCalculator();

test('$500 credit card loan at 18%APR paid weekly with interest calculated monthly', function(t) {
    t.plan(2);

    var params = {};
    params.startTime = Date.UTC(2017, 0, 1);
    params.totalAmount = 500;
    params.payment = 23;
    params.DayOfTheWeek = cal.FRIDAY;
    params.rate = ".18";
    params.abortDate = new Date(Date.UTC(2017, 0, 8));

    var result = payoffDateCalculator.getPayoffDate(params);
    var expectedToAddEachYear = result.date;

    var expectedEndTime = Date.UTC(2017, cal.NOVEMBER, 17);
    t.equal(result.date.toISOString(), '2017-01-07T00:00:00.000Z');
    t.equal(result.totalInterest,  1.72488141440276, 'interest for first week');

});

test('payoff date test', function(t) {
    t.plan(1);

    var params = {};
    params.startTime = Date.UTC(2016, 11, 20);
    params.totalAmount = 6000;
    params.payment = 125;
    params.DayOfTheWeek = cal.FRIDAY;

    var expectedToAddEachYear = payoffDateCalculator.getPayoffDate(params).date;

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

    var expectedToAddEachYear = payoffDateCalculator.getPayoffDate(params).date;

    var expectedEndTime = Date.UTC(2017, cal.DECEMBER, 29);

    t.equal(
        JSON.stringify(expectedToAddEachYear),
        JSON.stringify(new Date(expectedEndTime)),
        'weekly payment date (without considering interest)');

});

test('payments must be greater than interest accrued.', function(t) {
    t.plan(1);

    var params = {};
    params.startTime = Date.UTC(2017, 1, 2);
    params.totalAmount = 19000;

    params.payment = 71;
    params.DayOfTheWeek = cal.FRIDAY;
    params.rate = '.19720';

    try {
        payoffDateCalculator.getPayoffDate(params);
        t.fail();
    } catch (err) {
        t.equal(err, 'payment must be greater than interest accrued.');
    }

});

test('student loan.', function(t) {
    t.plan(1);

    var loan = {};
    loan.startTime = Date.UTC(2017, 1, 2);
    loan.totalAmount = 19000;
    loan.DayOfTheWeek = cal.FRIDAY;
    loan.rate = '.19720';

    var actual;
    var response;

    for (loan.payment = 72; loan.payment < 250; loan.payment += 1) {
        response = payoffDateCalculator.getPayoffDate(loan);
        actual = response.date;

        var msg =
            'monthly payment: ' + Math.ceil(loan.payment * cal.WEEKS_IN_MONTH) +
            ' payoff date: ' + JSON.stringify(actual) +
            ' total interest: ' + Math.ceil(response.totalInterest);

        //console.log(msg);
    }

    loan.payment = 72;
    actual = payoffDateCalculator.getPayoffDate(loan).date;

    var expectedEndTime = Date.UTC(2047, cal.MARCH, 22);

    t.equal(
        JSON.stringify(actual),
        JSON.stringify(new Date(expectedEndTime)),
        'weekly payment date (without considering interest)');

});
