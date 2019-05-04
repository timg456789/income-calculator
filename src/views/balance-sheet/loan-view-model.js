const cal = require('income-calculator/src/calendar');
const PayoffDateCalculator = require('income-calculator/src/payoff-date-calculator');
const payoffDateCalculator = new PayoffDateCalculator();
const Util = require('../../util');

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
    this.getHeaderView = function() {
        return $(`<div class="row table-header-row">
              <div class="col-xs-2">Amount</div>
              <div class="col-xs-3">Name</div>
              <div class="col-xs-2">Rate</div>
              <div class="col-xs-2">Payoff Date</div>
              <div class="col-xs-2">Interest at Payoff</div>
          </div>`);
    };
    this.getView = function (amount, name, rate, weeklyAmount) {
        var html = `<div class="balance-item row transaction-input-view">
                    <div class="col-xs-2">
                        <div class="input-group">
                            <div class="input-group-addon ">$</div>
                            <input class="amount form-control text-right" type="text" value="${amount}" />
                        </div>
                    </div>
                    <div class="col-xs-3"><input class="name form-control" type="text" value="${name}" /></div>
                    <div class="col-xs-2"><input class="rate form-control text-right" type="text" value="${rate}" /></div>
    `;
        if (weeklyAmount) {
            var payoffDate;
            var totalInterest;
            try {
                var balanceStatement = payoffDateCalculator.getPayoffDate({
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

                payoffDate = balanceStatement.date.getUTCFullYear() + '-' +
                    (balanceStatement.date.getUTCMonth() + 1) + '-' +
                    balanceStatement.date.getUTCDate();
                totalInterest = Math.ceil(balanceStatement.totalInterest);
            } catch (err) {
                payoffDate = err;
                totalInterest = err;
            }
            html += `<div class="col-xs-2 text-center vertical-align amount-description-column">${payoffDate}</div>`;
            html += `<div class="col-xs-2 text-right vertical-align amount-description-column">${Util.format(totalInterest)}</div>`;
        }
        html += '</div>';
        var view = $(html);
        var removeButtonHtml = `<div class="col-xs-1 remove-button-container">
                                <button class="btn remove add-remove-btn-container add-remove-btn" title="Remove Loan">
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