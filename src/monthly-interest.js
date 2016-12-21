
function YearlyInterest() {

    function getYearsEndTotal(yearStartTotal, yearlyAddition, yearlyInterestRate) {
        var total = yearStartTotal * yearlyInterestRate;
        total += yearlyAddition;
        return total;
    }

    this.calcSavings = function (yearlyAddition, years, yearlyInterestRate) {
        const cal = require('../src/calendar');
        var total = yearlyAddition;

        // if more than one year.
        for (var currentCompleteYear = 1; currentCompleteYear < years; currentCompleteYear++) {
            total += getYearsEndTotal(total, yearlyAddition, yearlyInterestRate);
        }

        return total;
    };

}

module.exports = YearlyInterest;