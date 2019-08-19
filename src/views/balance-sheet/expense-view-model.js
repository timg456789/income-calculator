const Currency = require('currency.js');
const DataClient = require('../../data-client');
const Moment = require('moment/moment');
const Util = require('../../util');
function ExpenseViewModel() {
    this.getViewType = function() {
        return 'expense';
    };
    this.getModel = function (target) {
        return {
            amount: $(target).find('input.amount').val().trim(),
            name: $(target).find('input.name').val().trim(),
            creditAccount: 'Expenses'
        };
    };
    this.getView = function (model) {
        if (!model) {
            model = {};
        }
        return $(`<div class="bond-item transaction-input-view row">
                    <div class="col-xs-4">
                        <div class="input-group">
                            <div class="input-group-addon ">$</div>
                            <input class="amount form-control text-right" type="text" placeholder="${model.amount || '0.00'}" />
                        </div>
                    </div>
                    <div class="col-xs-8">
                        <input class="col-xs-3 name form-control" type="text" value="${model.name || ''}" />
                    </div>
                  </div>`);
    };
    this.getHeaderView = function () {
        return $(`<div class="row table-header-row">
              <div class="col-xs-4">Amount</div>
              <div class="col-xs-8">Name</div>
          </div>`);
    };
}

module.exports = ExpenseViewModel;