const $ = require('jquery');
const calendarView = require('./calendar-view');

const cal = require('income-calculator/calendar');
const NetIncomeCalculator = require('income-calculator/net-income-calculator');
const netIncomeCalculator = new NetIncomeCalculator();

const CalendarAggregator = require('income-calculator/calendar-aggregator');
const calendarAggregator = new CalendarAggregator();

const MonthlyTotals = require('income-calculator/monthly-totals');
const monthlyTotals = new MonthlyTotals();

const config = {
    monthlyRecurringExpenses: [
        { name: 'rent', amount: 550 * 100, date: new Date(2016, cal.SEPTEMBER, cal.SAFE_LAST_DAY_OF_MONTH - 1) },
        { name: 'utilities', amount: 100 * 100, date: new Date(2016, cal.SEPTEMBER, 20)  }
    ],
    weeklyRecurringExpenses: [
        { name: 'food', amount: 75  * 100 }
    ],
    biWeeklyIncome: {
        amount: 1335  * 100
    },
    oneTimeExpenses: [
        { name: 'taxes', amount: 300 * 100, dateIncurred: new Date(2016, cal.APRIL, 17) },
        { name: 'taxes', amount: 400 * 100, dateIncurred: new Date(2016, cal.SEPTEMBER, 17) }
    ]
};

var breakdown = netIncomeCalculator.getBreakdown(
    config,
    new Date(2016, cal.SEPTEMBER, 1).getTime(), //start is inclusive.
    new Date(2016, cal.NOVEMBER, 1).getTime()); //end is exclusive.

var weeklyTotals = calendarAggregator.getWeeklyTotals(breakdown);
var totalsForMonth = monthlyTotals.getMonthlyTotals(weeklyTotals);

$(document).ready(function() {
    calendarView.build(totalsForMonth);
    calendarView.load(totalsForMonth);
});