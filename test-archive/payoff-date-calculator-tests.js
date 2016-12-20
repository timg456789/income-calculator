const test = require('tape');
const cal = require('../src/calendar');
const PayoffDateCalculator = require('../src/payoff-date-calculator');
const payoffDateCalculator = new PayoffDateCalculator();

test('payoff date test', function(t) {
    t.plan(1);

    var expectedToAddEachYear = payoffDateCalculator.getPayoffDate(
        Date.UTC(2016, 11, 20), 6000, 125, cal.FRIDAY
    );

    t.equal(
        JSON.stringify(expectedToAddEachYear),
        JSON.stringify(new Date(Date.UTC(2017, cal.NOVEMBER, 17))),
        'weekly payment date (without considering interest)');

});