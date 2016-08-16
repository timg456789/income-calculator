var cal = require ('./calendar');
var PayrollCalendar = require('./payroll-calendar');

if (process.argv.length != 4) {
    console.log('start and end years are required e.g. --start 2016 --end 2017')
} else {
    var startYear = process.argv[2];
    var endYear = process.argv[3];

    if (startYear && endYear) {

        var startDate = new Date(startYear, 0, 1);
        var endDate = new Date(endYear, 0, 1);

        var calConfig = {
            firstPayDateTime: cal.BIWEEKLY_PAY_START_DATE.getTime(),
            interval: cal.BIWEEKLY_INTERVAL
        };

        var payrollCalendar = new PayrollCalendar(calConfig);

        while(startDate < endDate) {
            startDate = payrollCalendar.getNextDate(startDate.getTime());
            console.log(startDate.toISOString());
        }

    } else {
        console.log('start and end year are required.');
    }
}