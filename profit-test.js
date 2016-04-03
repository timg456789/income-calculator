var test = require('tape');
var calc = require('./calculator');
var data = require('./data');

test('profits for april 2016', function(t) {
    t.plan(1);

    var expectedProfits = data.recurringIncomeApril2016 - data.recurringExpensesApril2016;
    var expenses = calc.getExpenses(data.aprilExpensesConfig);

    var rate = data.biweeklyRate;
    var startDate = new Date(2016, 2, 26);
    var endDate = new Date(2016, 3, 30);

    var payrollCalendar = new PayrollCalendar({
        firstPayDateTime: cal.BIWEEKLY_PAY_START_DATE.getTime(),
        interval: cal.BIWEEKLY_INTERVAL
    });

    var revenue = payrollCalendar.getRecurringIncome(
        startDate.getTime(),
        endDate.getTime(),
        rate);

    var profits = revenue - expenses;

    t.equal(profits, expectedProfits, 'profits for april 2016: ' + profits);
});