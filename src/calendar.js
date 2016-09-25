exports.JANUARY = 0;
exports.FEBRUARY = 1;
exports.MARCH = 2;
exports.APRIL = 3;
exports.MAY = 4;
exports.JUNE = 5;
exports.JULY = 6;
exports.AUGUST = 7;
exports.SEPTEMBER = 8;
exports.OCTOBER = 9;
exports.NOVEMBER = 10;
exports.DECEMBER = 11;

exports.MONTHS_IN_YEAR = 12;

exports.SAFE_LAST_DAY_OF_MONTH = 28;

exports.BIWEEKLY_PAY_START_DATE = new Date(Date.UTC(2015, 11, 25));
exports.BIWEEKLY_INTERVAL = 14;
exports.FRIDAY = 5;
exports.DAYS_IN_WEEK = 7;

exports.BIWEEKLY_CALENDAR_CONFIG = {
    firstPayDateTime: exports.BIWEEKLY_PAY_START_DATE.getTime(),
    interval: exports.BIWEEKLY_INTERVAL
};

exports.MONTH_NAMES = [ 'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

exports.MONTH_NAME_ABBRS = [ 'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ];

exports.DAY_NAMES = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

exports.DAY_NAME_ABBRS = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
