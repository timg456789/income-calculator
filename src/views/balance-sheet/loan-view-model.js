const cal = require('../../calculators/calendar');
const PayoffDateCalculator = require('../../calculators/payoff-date-calculator');
const payoffDateCalculator = new PayoffDateCalculator();
const Util = require('../../util');
const Currency = require('currency.js');
function LoanViewModel() {
    let self = this;
    this.getModels = function() {
        var balances = [];
        $('.balance-item').each(function () {
            balances.push(self.getModel(this));
        });
        return balances;
    };
    this.getModel = function (target) {
        return {
            "amount": $(target).find('input.amount').val().trim(),
            "name": $(target).find('input.name').val().trim(),
            "rate": $(target).find('input.rate').val().trim()
        };
    };
    this.getView = function (amount, name, rate, weeklyAmount) {
        let payOffDateText;
        let totalInterestText;
        if (weeklyAmount) {
            let payoffDate;
            let totalInterest;
            try {
                let balanceStatement = payoffDateCalculator.getPayoffDate({
                    startTime: Date.UTC(
                        new Date().getUTCFullYear(),
                        new Date().getUTCMonth(),
                        new Date().getUTCDate()
                    ),
                    totalAmount: amount,
                    payment: weeklyAmount,
                    DayOfTheWeek: cal.FRIDAY,
                    rate: rate
                });

                payOffDateText = balanceStatement.date.getUTCFullYear() + '-' +
                    (balanceStatement.date.getUTCMonth() + 1) + '-' +
                    balanceStatement.date.getUTCDate();
                totalInterestText = Util.format(Math.ceil(balanceStatement.totalInterest));
            } catch (err) {
                payOffDateText = err;
                totalInterestText = err;
            }
        } else {
            payOffDateText = 'WARNING: no payment specified';
            let infinitySymbol = '&#8734;';
            totalInterestText = infinitySymbol;
        }
        let lifetimeInterest = Currency(totalInterestText).divide(amount).multiply(100);
        let view = $(`<div class="balance-item row transaction-input-view">
                    <div class="col-xs-2">
                        <div class="input-group">
                            <div class="input-group-addon ">$</div>
                            <input class="amount form-control text-right" type="text" value="${amount}" />
                        </div>
                    </div>
                    <div class="col-xs-3"><input class="name form-control" type="text" value="${name}" /></div>
                    <div class="col-xs-1"><input class="rate form-control text-right" type="text" value="${rate}" /></div>
                    <div class="col-xs-2 text-center vertical-align amount-description-column">${payOffDateText}</div>
                    <div class="col-xs-2 text-right vertical-align amount-description-column">${totalInterestText}</div>
                    <div class="col-xs-1 text-right vertical-align amount-description-column">${lifetimeInterest}%</div>
                    </div>
        `);
        let removeButtonHtml = `<div class="col-xs-1">
                                <button class="btn remove add-remove-btn" title="Remove Loan">
                                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                </button>
                            </div>`;
        let removeButton = $(removeButtonHtml);
        removeButton.click(function () {
            view.remove();
        });
        view.append(removeButton);
        return view;
    };
}

module.exports = LoanViewModel;