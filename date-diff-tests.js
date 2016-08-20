var cal = require('./calendar.js');

var firstPayDate = new Date(cal.BIWEEKLY_PAY_START_DATE.getTime());
console.log(firstPayDate);

var nextPayDate = new Date(cal.BIWEEKLY_PAY_START_DATE.getTime());
nextPayDate.setDate(nextPayDate.getDate() + cal.BIWEEKLY_INTERVAL);

console.log(nextPayDate);

var diff = nextPayDate - firstPayDate;

console.log(diff);
console.log(diff / (cal.BIWEEKLY_INTERVAL * cal.UTC_DAY_MILLISECONDS));

console.log(new Date(0));
console.log(new Date(cal.UTC_DAY_MILLISECONDS));