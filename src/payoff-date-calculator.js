function PayoffDateCalculator() {

    var cal = require('./calendar');

    this.getWeeklyInterest = function (balance, apr) {
        var monthlyInterest = this.getMonthlyInterest(balance, apr);
        var weeklyInterest = monthlyInterest / cal.WEEKS_IN_MONTH;
        return weeklyInterest;
    };

    this.getMonthlyInterest = function (balance, apr) {
        var monthlyRate = apr/12;
        return balance * monthlyRate;
    };

    this.getPayoffDate = function(params) {
        var currentDate = new Date(params.startTime);
        var balance = params.totalAmount;

        if (!params.rate) {
            params.rate = 0;
        }

        while (balance > 0) {

            if (currentDate.getUTCDay() === params.DayOfTheWeek) {
                var weeklyInterest = this.getWeeklyInterest(balance, params.rate);
                var principle = params.payment - weeklyInterest;
                balance -= principle;
            }

            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        currentDate.setUTCDate(currentDate.getUTCDate() - 1);

        return currentDate;
    };

}

module.exports = PayoffDateCalculator;