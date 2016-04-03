var test = require('tape');
var cal = require('./calendar');
var calc = require('./calculator');
var data = require('./data');
var PayrollCalendar = require('./payroll-calendar');

test('profits for april 2016', function(t) {
    t.plan(1);

    var expenses = calc.total(data.aprilExpensesConfig);

    var rate = data.biweeklyRate;
    var startDate = new Date(2016, 2, 26);
    var endDate = new Date(2016, 3, 30);

    var payrollCalendar = new PayrollCalendar(cal.BIWEEKLY_CALENDAR_CONFIG);

    var incomeConfig = {
        rate: data.biweeklyRate,
        startTime: new Date(2016, 2, 26).getTime(),
        endTime: new Date(2016, 3, 30).getTime()
    };

    var revenue = payrollCalendar.getRecurringIncome(incomeConfig);

    var profits = revenue - expenses;

    var expectedProfits = data.recurringIncomeApril2016 - data.recurringExpensesApril2016;
    t.equal(profits, expectedProfits, 'profits for april 2016: ' + profits);
});