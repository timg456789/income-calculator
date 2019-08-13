const CalendarSearch = require('./calendar-search');
const Currency = require('currency.js');
function CalendarAggregator() {
    const calendarSearch = new CalendarSearch();
    this.getSummary = function (startTime, endTime, budget) {
        let summary = {};
        summary.budgetItems = calendarSearch.find(startTime, endTime, budget);
        summary.budgetedNet = getSimpleTotal(summary.budgetItems);
        summary.net = summary.budgetedNet;
        return summary;
    };
    function getSimpleTotal(budget) {
        let net = Currency(0, {precision: 10});
        for (let item of budget) {
            let dollarAmount = Currency(item.amount, {precision: 10}).divide(100);
            net = item.type === 'expense'
                ? net.subtract(dollarAmount)
                : net.add(dollarAmount);
        }
        return net.toString();
    }
}

module.exports = CalendarAggregator;
