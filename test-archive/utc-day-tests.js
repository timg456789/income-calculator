const cal = require('../src/calendar');
const test = require('tape');

const UtcDay = require('../src/utc-day');
const utcDay = new UtcDay();

// UtcDayDiff needs to be used with times which have been generated from UTC dates.
// Not local dates which have been converted to UTC dates.
// This test shows its true value when run on  a system that is in Eastern Time.
test('checking pay date september 2, 2016', function(t) {
    t.plan(1);

    var payStartDate = cal.BIWEEKLY_PAY_START_DATE;
    var payStartDateTime = cal.BIWEEKLY_PAY_START_DATE.getTime();

    var testDate = new Date(Date.UTC(2016, cal.SEPTEMBER, 2));
    var testTime = testDate.getTime();

    var diff = utcDay.getDayDiff(payStartDateTime, testTime);

    var offBy = diff % cal.BIWEEKLY_INTERVAL;

    t.equal(offBy, 0, 'september 2 is a pay date and is a multiple of 14 away from the first pay date');

});

