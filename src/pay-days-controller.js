const moment = require('moment');
const cal = require('income-calculator/src/calendar');
const UtcDay = require('income-calculator/src/utc-day');
const DataClient = require('./data-client');
const Currency = require('currency.js');
const AssetViewModel = require('./asset-view-model');

function PayDaysController() {
    'use strict';
    let dataClient;
    let settings;

    function log(error) {
        console.log(error);
        $('#debug-console').append('<div>' + error + '</div>');
    }
    function agreedToLicense() {
        return $('#acceptLicense').is(':checked');
    }
    function getView(paymentNumber, payDate) {
        return `<div class="row">
                    <div class="col-xs-1 text-right">
                        ${paymentNumber}
                    </div>
                    <div class="col-xs-11">
                        ${payDate}
                    </div>
                </div>`;
    }

    function getPayDates() {
        let paymentDates = [];
        let current = moment().utc().startOf('day');

        let end = moment().utc().endOf('year');
        let firstPayDateTime = moment('2019-04-12T00:00:00.000Z', moment.ISO_8601);
        while (current < end) {
            let diffFromFirstPayDate = new UtcDay().getDayDiff(firstPayDateTime, current.valueOf());
            let modulusIntervalsFromFirstPayDate = diffFromFirstPayDate % cal.BIWEEKLY_INTERVAL;
            if (modulusIntervalsFromFirstPayDate === 0) {
                paymentDates.push(current.toISOString());
            }
            current = current.add(1, 'day');
        }
        return paymentDates;
    }

    async function initAsync() {
        let data = await dataClient.getData();
        $('#401k-contribution-for-year').val(data['401k-contribution-for-year']);
        $('#401k-contribution-per-pay-check').val(data['401k-contribution-per-pay-check']);
        $('#acceptLicense').prop('checked', settings.agreedToLicense);

        let max401kContribution = 19000;
        $('#max-401k-contribution').text(AssetViewModel.format(max401kContribution));

        let payDates = getPayDates();
        payDates.forEach((paymentDate, index) => {
            $('.pay-days-container').append(getView(index + 1, paymentDate));
        });
        let projectedContributionForYear = Currency(data['401k-contribution-for-year']).add(
            Currency(data['401k-contribution-per-pay-check']).multiply(payDates.length)
        );
        $('#projected-contribution-for-year').text(AssetViewModel.format(projectedContributionForYear.toString()));
        $('#paychecks-remaining').text(payDates.length);
        let shouldContributePerPaycheck = Currency(19000)
            .subtract(data['401k-contribution-for-year'])
            .divide(payDates.length);
        let remainingShouldContribute = shouldContributePerPaycheck.multiply(payDates.length);
        let totalShouldcontribute = remainingShouldContribute.add(data['401k-contribution-for-year']);
        $('#should-contribute-for-max').text(AssetViewModel.format(shouldContributePerPaycheck.toString()));
        $('#remaining-should-contribute-for-year').text(AssetViewModel.format(remainingShouldContribute.toString()));
        $('#total-should-contribute-for-year').text(AssetViewModel.format(totalShouldcontribute.toString()));

        $('#pay-days-save').click(function () {
            if (!agreedToLicense()) {
                return;
            }
            let patch = {};
            patch['401k-contribution-for-year'] = Currency($('#401k-contribution-for-year').val().trim()).toString();
            patch['401k-contribution-per-pay-check'] = Currency($('#401k-contribution-per-pay-check').val().trim()).toString();
            dataClient.patch(settings.s3ObjectKey, patch)
                .then(data => {
                    window.location='./pay-days.html'+window.location.search;
                })
                .catch(err => {
                    log(err);
                    log('failure saving settings: ' + JSON.stringify(err, 0, 4));
                })
        });
    }

    this.init = function (settingsIn) {
        settings = settingsIn;
        dataClient = new DataClient(settings);
        initAsync()
            .catch(err => { log(err); });
    };

}

module.exports = PayDaysController;