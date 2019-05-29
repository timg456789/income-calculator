const Currency = require('currency.js/dist/currency.js');
const DataClient = require('../../data-client');
const Moment = require('moment/moment');
const Util = require('../../util');
function BondViewModel() {
    let self = this;
    this.getViewType = function() {
        return 'bond';
    };
    this.getModel = function (target) {
        return {
            amount: $(target).find('input.amount').val().trim(),
            issueDate: Moment($(target).find('input.issue-date').val().trim(), 'YYYY-MM-DD UTC Z'),
            daysToMaturation: $(target).find('select.type').val().trim(),
            creditAccount: 'Bonds'
        };
    };
    this.getHeaderView = function () {
        return $(`<div class="row table-header-row">
              <div class="col-xs-4">Face Value</div>
              <div class="col-xs-4">Issue Date</div>
              <div class="col-xs-4">Time to Maturity</div>
          </div>`);
    };
    this.getReadOnlyView = function(model) {
        if (!model) {
            model = {};
        }
        let maturityDateText = model.issueDate
            ? Moment(model.issueDate).add(model.daysToMaturation, 'days').format('YYYY-MM-DD')
            : '';
        if (!model.issueDate) {
            model.issueDate = new Date().toISOString();
        }
        if (!model.amount) {
            model.amount = '0.00';
        }
        let view = $(`<div class="bond-item transaction-input-view row">
                    <div class="col-xs-2 text-right vertical-align amount-description-column">
                        ${Util.format(model.amount)}
                    </div>
                    <div class="col-xs-4 text-center vertical-align amount-description-column">
                        ${Moment(model.issueDate).format('YYYY-MM-DD')}
                    </div>
                    <div class="col-xs-3 text-center">
                        ${model.daysToMaturation/7} weeks
                    </div>
                    <div class="col-xs-2 text-center vertical-align amount-description-column">${maturityDateText}</div>
        `);
        let liquidateButton = $(`<div class="col-xs-1">
                            <button type="button" class="btn btn-success add-remove-btn" title="Liquidate bond">
                                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                            </button>
                          </div>`);
        liquidateButton.click(function () {
            let settings = Util.settings();

            let dataClient = new DataClient(settings);
            dataClient.getData()
                .then(data => {
                    let cashAccount = data.assets.find(x => x.name.toLowerCase() === 'cash');
                    if (!cashAccount) {
                        throw 'C=cash account not found';
                    }
                    let currentCash = Currency(cashAccount.amount);
                    cashAccount.amount = currentCash.add(model.amount).toString();
                    let patch = {};
                    patch.assets = data.assets;
                    patch.bonds = data.bonds.filter(x => x.id !== model.id);
                    return dataClient.patch(settings.s3ObjectKey, patch);
                })
                .then(putResult => { window.location.reload(); })
                .catch(err => { Util.log(err); });
        });
        view.append(liquidateButton);
        return view;
    };
    this.getView = function (model) {
        if (!model) {
            model = {};
        }
        let maturityDateText = model.issueDate
            ? Moment(model.issueDate).add(model.daysToMaturation, 'days').format('YYYY-MM-DD')
            : '';
        if (!model.issueDate) {
            model.issueDate = new Date().toISOString();
        }
        if (!model.amount) {
            model.amount = '0.00';
        }
        let issueDateText = Moment(model.issueDate).format('YYYY-MM-DD UTC Z');
        let view = $(`<div class="bond-item transaction-input-view row">
                    <div class="col-xs-4">
                        <div class="input-group">
                            <div class="input-group-addon ">$</div>
                            <input class="amount form-control text-right" type="text" value="${model.amount}" />
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <input class="col-xs-3 issue-date form-control" type="text" value="${issueDateText}" />
                    </div>
                    <div class="col-xs-4">
                        <select class="type form-control">
                            <option value="28" ${model.daysToMaturation == 28 ? 'selected="selected"' : ''}>4 Weeks</option>
                            <option value="56" ${model.daysToMaturation == 56 ? 'selected="selected"' : ''}">8 Weeks</option>
                        </select>
                    </div>
        `);
        return view;
    };
}

module.exports = BondViewModel;