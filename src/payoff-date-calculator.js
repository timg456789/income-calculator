function PayoffDateCalculator() {

    this.getPayoffDate = function(dateIn, totalAmount, payment, paymentDay) {
        var currentDate = new Date(dateIn);
        var balance = totalAmount;

        while (balance > 0) {
            if (currentDate.getUTCDay() === paymentDay) {
                balance -= payment;
            }

            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        currentDate.setUTCDate(currentDate.getUTCDate() - 1);

        return currentDate;
    };

}

module.exports = PayoffDateCalculator;