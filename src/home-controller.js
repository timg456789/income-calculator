function HomeController() {
    'use strict';

    var $ = require('jquery');
    const calendarView = require('./calendar-view');
    const homeView = require('./home-view');
    var bucket = 'income-calculator';
    var s3ObjKey;
    var accessKeyId;
    var secretAccessKey;

    function log(error) {
        console.log(error);
        $('#debug-console').append('<div>' + error + '</div>');
    }

    function checkNet() {
        const EXPECTED_MONTHLY_NET = 172000;

        var displayedNet = parseInt($('#month-net-header-value').html());
        if (displayedNet !== EXPECTED_MONTHLY_NET / 100) {
            log('expected net of ' +
                    (EXPECTED_MONTHLY_NET / 100) +
                    ' for October 2016, but was: ' + displayedNet);
        }

        var displayedNetByWeek = $('#month-net-header-value')
            .attr('data-net-by-weekly-totals');
        displayedNetByWeek = parseInt(displayedNetByWeek);
        if (displayedNetByWeek !== EXPECTED_MONTHLY_NET) {
            log('expected net of ' +
                    EXPECTED_MONTHLY_NET +
                    ' for October 2016, but was: ' + displayedNetByWeek);
        }

    }

    function getS3Params() {
        return {
            Bucket: bucket,
            Key: s3ObjKey
        };
    }

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
            s3ObjKey = guid() + '.json';
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

            var url = updateQueryStringParameter(location.href, 'data', options.Key);
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

    function refresh() {
        dataFactory().getObject(getS3Params(), function (err, data) {
            if (err) {
                log(JSON.stringify(err, 0, 4));
            }
            homeView.setView(JSON.parse(data.Body.toString('utf-8')));
        });
    }

    this.init = function (s3ObjKeyIn, accessKeyIdIn, secretAccessKeyIn) {
        s3ObjKey = s3ObjKeyIn;
        accessKeyId = accessKeyIdIn;
        secretAccessKey = secretAccessKeyIn;

        $('#load-budget').click(function () {
            refresh();
        });

        $('#project').click(function () {
            var year = $('#calendar-year');
            var month = $('#calendar-month');
            project(year, month);
        });

        $('#add-new-monthly-epense').click(function () {
            $('#monthly-input-group').append(homeView.getTransactionView({}, 'monthly', 'expense'));
        });

        $('#add-new-weekly-expense').click(function () {
            $('#weekly-input-group').append(homeView.getTransactionView({}, 'weekly', 'expense'));
        });

        $('#add-new-one-time-expense').click(function () {
            $('#one-time-input-group').append(homeView.getTransactionView({}, 'one-time', 'expense'));
        });

        $('#add-new-actual-expense').click(function () {
            $('#actuals-input-group').append(homeView.getTransactionView({budget: ''}, 'actual', 'expense'));
        });


        if (s3ObjKey) {
            refresh();
        }
    };

}

module.exports = HomeController;