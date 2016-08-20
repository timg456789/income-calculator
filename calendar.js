exports.MARCH = 2;
exports.APRIL = 3;
exports.MAY = 4;
exports.SEPTEMBER = 8;
exports.OCTOBER = 9;
exports.NOVEMBER = 10;

exports.SAFE_LAST_DAY_OF_MONTH = 28;

exports.BIWEEKLY_PAY_START_DATE = new Date(2015, 11, 25);
exports.BIWEEKLY_INTERVAL = 14;
exports.FRIDAY = 5;

exports.UTC_DAY_MILLISECONDS = 86400000;

exports.BIWEEKLY_CALENDAR_CONFIG = {
    firstPayDateTime: exports.BIWEEKLY_PAY_START_DATE.getTime(),
    interval: exports.BIWEEKLY_INTERVAL
};