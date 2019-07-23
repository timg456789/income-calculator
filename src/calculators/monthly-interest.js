
function MonthlyInterest() {

    function getInterest(total, rate) {
        return total * rate;
    }

    this.calcSavings = function (monthlyAddition, months, yearlyInterestRate) {
        var total = monthlyAddition;
        var monthlyInterestRate = yearlyInterestRate/12;

        // if more than one month.
        for (var currentCompleteMonth = 1; currentCompleteMonth < months; currentCompleteMonth++) {
            var interest = getInterest(total, monthlyInterestRate);
            var newTotal = interest + monthlyAddition;
            total += newTotal;
        }

        return total;
    };

}

module.exports = MonthlyInterest;