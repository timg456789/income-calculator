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
        var balance = params.totalAmount;
        var response = {};
        response.date = new Date(params.startTime);
        response.totalInterest = 0;

        if (!params.rate) {
            params.rate = 0;
        }

        while (balance > 0) {

            if (params.abortDate &&
                params.abortDate.getTime() <= response.date.getTime()) {
                break;
            }

            if (response.date.getUTCDay() === params.DayOfTheWeek) {
                var weeklyInterest = this.getWeeklyInterest(balance, params.rate);
                response.totalInterest += weeklyInterest;

                if (weeklyInterest > params.payment) {
                    throw 'payment must be greater than interest accrued.';
                }

                var principle = params.payment - weeklyInterest;
                balance -= principle;
            }

            response.date.setUTCDate(response.date.getUTCDate() + 1);
        }

        response.date.setUTCDate(response.date.getUTCDate() - 1);

        return response;
    };

}

module.exports = PayoffDateCalculator;
