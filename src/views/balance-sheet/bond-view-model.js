const moment = require('moment/moment');

function BondViewModel() {
    let self = this;
    this.getModels = function() {
        let models = [];
        $('.bond-item').each(function () {
            models.push(self.getModel(this));
        });
        models.sort((a, b) =>
            moment(a.issueDate).add(a.daysToMaturation, 'days').valueOf() -
            moment(b.issueDate).add(b.daysToMaturation, 'days').valueOf());
        return models;
    };
    this.getModel = function (target) {
        return {
            amount: $(target).find('input.amount').val().trim(),
            issueDate: moment($(target).find('input.issue-date').val().trim(), 'YYYY-MM-DD UTC Z'),
            daysToMaturation: $(target).find('select.type').val().trim(),
            creditAccount: 'Bonds'
        };
    };
    this.getHeaderView = function () {
        return $(`<div class="row table-header-row">
              <div class="col-xs-2">Face Value</div>
              <div class="col-xs-4">Issue Date</div>
              <div class="col-xs-3">Time to Maturity</div>
              <div class="col-xs-2">Maturity Date</div>
          </div>`);
    };
    this.getView = function (model) {
        if (!model) {
            model = {};
        }
        if (!model.issueDate) {
            model.issueDate = new Date().toISOString();
        }
        if (!model.amount) {
            model.amount = '0.00';
        }
        let issueDateText = moment(model.issueDate).format('YYYY-MM-DD UTC Z');
        let maturityDateText = moment(model.issueDate).add(model.daysToMaturation, 'days').format('YYYY-MM-DD');
        var view = $(`<div class="bond-item transaction-input-view row">
                    <div class="col-xs-2">
                        <div class="input-group">
                            <div class="input-group-addon ">$</div>
                            <input class="amount form-control text-right" type="text" value="${model.amount}" />
                        </div>
                    </div>
                    <div class="col-xs-4"><input class="col-xs-3 issue-date form-control" type="text" value="${issueDateText}" /></div>
                    <div class="col-xs-3">
                        <select class="type form-control">
                            <option value="28" ${model.daysToMaturation == 28 ? 'selected="selected"' : ''}>4 Weeks</option>
                            <option value="56" ${model.daysToMaturation == 56 ? 'selected="selected"' : ''}">8 Weeks</option>
                        </select>
                    </div>
                    <div class="col-xs-2 text-center vertical-align amount-description-column">${maturityDateText}</div>
    `);
        var removeButton = $(`<div class="col-xs-1 remove-button-container">
                            <button class="btn remove add-remove-btn-container add-remove-btn" title="Remove Bond">
                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            </button>
                          </div>`);

        removeButton.click(function () {
            view.remove();
        });
        view.append(removeButton);
        return view;
    };
}

module.exports = BondViewModel;