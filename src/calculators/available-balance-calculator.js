const Currency = require('currency.js');
function AvailableBalanceCalculator() {
    this.getAvailableBalance = function (accountName, startingBalance, allPendingTransfers) {
        return (allPendingTransfers || []).filter(x =>
            x.creditAccount.toLowerCase() === accountName.toLowerCase() ||
            x.debitAccount.toLowerCase() === accountName.toLowerCase())
                .reduce((sumTransfer, transfer) => {
                    sumTransfer.amount = transfer.creditAccount.toLowerCase() === accountName.toLowerCase()
                        ? sumTransfer.amount.add(transfer.amount)
                        : sumTransfer.amount.subtract(transfer.amount);
                    return sumTransfer;
        }, {amount: Currency(startingBalance)}).amount.toString();
    };
}
module.exports = AvailableBalanceCalculator;