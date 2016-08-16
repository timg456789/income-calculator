exports.MARCH = 2;
exports.APRIL = 3;
exports.MAY = 4;
exports.SEPTEMBER = 8;

exports.BIWEEKLY_PAY_START_DATE = new Date(2015, 11, 25);
exports.BIWEEKLY_INTERVAL = 14;
exports.FRIDAY = 5;

exports.BIWEEKLY_CALENDAR_CONFIG = {
    firstPayDateTime: exports.BIWEEKLY_PAY_START_DATE.getTime(),
    interval: exports.BIWEEKLY_INTERVAL
};