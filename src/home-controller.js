
function HomeController() {
    'use strict';

    const calendarView = require('./calendar-view');
    const homeView = require('./home-view');
    const BalanceViewModel = require('./balance-view-model');
    const AssetViewModel = require('./asset-view-model');
    const BondViewModel = require('./bond-view-model');
    const DataClient = require('./data-client');
    var bucket;
    var s3ObjKey;
    var accessKeyId;
    var secretAccessKey;
    var dataClient;

    function log(error) {
        console.log(error);
        $('#debug-console').append('<div>' + error + '</div>');
    }

    function checkNet() {
        var displayedNet = parseInt($('#month-net-header-value').html());
        var displayedNetByWeek = $('#month-net-header-value')
            .attr('data-net-by-weekly-totals');
        displayedNetByWeek = parseInt(displayedNetByWeek);
    }

    // REMOVE
    function getS3Params() {
        return {
            Bucket: bucket,
            Key: s3ObjKey
        };
    }

    // REMOVE
    function dataFactory() {
        var AWS = require('aws-sdk');
        AWS.config.update(
            {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                region: 'us-east-1'
            }
        );
        return new AWS.S3();
    }

    function hasCredentials() {
        return accessKeyId && secretAccessKey;
    }

    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1
            ? "&"
            : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            return uri + separator + key + "=" + value;
        }
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function save() {
        if (!s3ObjKey) {
            s3ObjKey = guid();
        }
        var s3 = dataFactory();
        var options = {};
        options.Bucket = bucket;
        options.Key = s3ObjKey;
        options.Body = JSON.stringify(homeView.getModel(), 0, 4);
        s3.upload(options, function (err) {
            if (err) {
                log('failure saving settings: ' + JSON.stringify(err, 0, 4));
            }

            var url = updateQueryStringParameter(location.href, 'data', s3ObjKey);
            url = updateQueryStringParameter(url, 'agreedToLicense', agreedToLicense());
            $('#output').append('<p>You can view this budget at anytime by viewing this ' +
                    '<a href="' + url + '">' + url + '</a>.' +
                    '</p>');

            $('#months-container').prepend(
                '<div id="calendar-legend">' +
                'Legend&nbsp;' +
                '<span class="transaction-view expense budgeted" title="expenditure that occurred within budget">' +
                'Budgeted Spending</span>' +
                '</span>' +
                '<span class="transaction-view expense" title="budgeted expense">' +
                'Budgeted Expense</span>' +
                '</div>'
            );

        });
    }

    function project() {
        var budgetSettings = homeView.getModel();
        var year = new Date().getUTCFullYear();
        var month = new Date().getUTCMonth();
        var start = new Date(Date.UTC(year, month, 1));
        var end = new Date(start.getTime());
        end.setUTCMonth(end.getUTCMonth() + 1);
        calendarView.build(year, month);
        calendarView.load(budgetSettings, budgetSettings.actual, start, end);
        checkNet();
        $('#input-form').hide();
        $('#output').empty();

        if (hasCredentials()) {
            save();
        }
    }

    async function refresh() {

        try {
            let data = await dataClient.getData();
            homeView.setView(JSON.parse(data.Body.toString('utf-8')));
        } catch (err) {
            log(JSON.stringify(err, 0, 4));
        }
    }
    
    function initGroup(name) {
        $('#add-new-' + name).click(function () {
            $('#' + name + '-input-group').append(homeView.getTransactionView({}, name, 'expense'));
        });
    }

    function agreedToLicense() {
        return $('#acceptLicense').is(':checked');
    }

    this.init = function (settings) {

        bucket = settings.s3Bucket;
        s3ObjKey = settings.s3ObjectKey;
        accessKeyId = settings.pub;
        secretAccessKey = settings.priv;
        dataClient = new DataClient(settings);

        $('#account-settings-button').click(function () {
            $('#account-settings-view').modal({
                backdrop: 'static'
            });
        });

        $('#budget-download').click(function () {
            dataFactory().getObject(getS3Params(), function (err, data) {
                if (err) {
                    log(JSON.stringify(err, 0, 4));
                }
                let pom = document.createElement('a');
                pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data.Body.toString('utf-8')));
                pom.setAttribute('download', getParameterByName('data'));
                if (document.createEvent) {
                    var event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    pom.dispatchEvent(event);
                }
                else {
                    pom.click();
                }
            });
        });
        $('#account-settings-save-close-button').click(function () {
            let newFileName = $('#budgetName').val().trim();
            let options = {
                Bucket: bucket,
                Key: newFileName,
                Body: JSON.stringify(homeView.getModel(), 0, 4)
            };
            let s3 = dataFactory();
            s3.upload(options, function (err) {
                if (err) {
                    log('failure saving settings: ' + JSON.stringify(err, 0, 4));
                }
                let url = updateQueryStringParameter(location.href, 'data', newFileName);
                url = updateQueryStringParameter(url, 'pub', $('#awsAccessKeyId').val().trim());
                url = updateQueryStringParameter(url, 'priv', $('#awsSecretAccessKey').val().trim());
                url = updateQueryStringParameter(url, 'agreedToLicense', agreedToLicense());
                window.location.href = url;
            });
        });

        $('#awsBucket').val(bucket);
        $('#budgetName').val(s3ObjKey);
        $('#awsAccessKeyId').val(settings.pub);
        $('#awsSecretAccessKey').val(settings.priv);
        $('#acceptLicense').prop('checked', settings.agreedToLicense);

        $('#load-budget').click(function () {
            refresh();
        });

        $('#project').click(function () {
            if (agreedToLicense()) {
                project();
            }
        });

        initGroup('monthly');
        initGroup('weekly');

        $('#add-new-one-time-expense').click(function () {
            $('#one-time-input-group').append(homeView.getTransactionView({}, 'one-time', 'expense'));
        });

        $('#add-new-actual-expense').click(function () {
            $('#actuals-input-group').append(homeView.getTransactionView({budget: ''}, 'actual', 'expense'));
        });

        $('#add-new-balance').click(function () {
            $('#balance-input-group').append(BalanceViewModel.getBalanceView(100, 'new balance', '.035'));
        });

        $('#add-new-asset').click(function () {
            $('#asset-input-group').append(AssetViewModel.getBalanceView(100, 'new asset'));
        });

        $('#add-new-bond').click(function () {
           $('#bond-input-group').append(BondViewModel.getBondView(100, '4-Week Bill', new Date().toISOString()));
        });

        if (s3ObjKey) {
            refresh();
        }
    };

    function getParameterByName(name) {
        'use strict';

        var url = location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return results[2];
    }

}

module.exports = HomeController;