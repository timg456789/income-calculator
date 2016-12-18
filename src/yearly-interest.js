
function YearlyInterest() {

    this.getYearsEndTotal = function (yearStartTotal, yearlyAddition, yearlyInterestRate) {
        var total = yearStartTotal * yearlyInterestRate;
        total += yearlyAddition;
        return total;
    };

    this.calcSavings = function (weeklySavings, years, yearlyInterestRate) {
        const cal = require('../src/calendar');
        var yearlyAddition = weeklySavings * cal.WEEKS_IN_YEAR;
        var total = yearlyAddition;

        for (var currentCompleteYear = 1; currentCompleteYear < years; currentCompleteYear++) {
            total += this.getYearsEndTotal(total, yearlyAddition, yearlyInterestRate);
        }

        return total;
    };
}

module.exports = YearlyInterest;