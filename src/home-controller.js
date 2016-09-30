function HomeController() {
    'use strict';

    var $ = require('jquery');
    const calendarView = require('./calendar-view');
    const homeView = require('./home-view');
    var bucket = 'income-calculator';
    var s3Obj;
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
            Key: s3Obj
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

    function refresh() {
        if (hasCredentials()) {
            dataFactory().getObject(getS3Params(), function (err, data) {
                if (err) {
                    log(JSON.stringify(err, 0, 4));
                }
                homeView.setView(JSON.parse(data.Body.toString('utf-8')));
            });
        } else {
            var url = 'https://s3.amazonaws.com/income-calculator/';
            url += s3Obj;
            $.getJSON(url, function (data) {
                homeView.setView(data);
            }).fail(function (jqxhr) {
                log(JSON.stringify(jqxhr, 0, 4));
            });
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
        var s3 = dataFactory();
        var options = {};
        options.Bucket = bucket;
        options.Key = guid() + '.json';
        options.Body = JSON.stringify(homeView.getModel(), 0, 4);
        s3.upload(options, function (err) {
            if (err) {
                log('failure saving settings: ' + JSON.stringify(err, 0, 4));
            }

            var url = location.href + "&data=" + options.Key;
            $('#output').append('<p>You can view this budget at anytime by viewing this ' +
                    '<a href="' + url + '">' + url + '</a>.' +
                    '</p>');
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

    this.init = function (s3ObjIn, accessKeyIdIn, secretAccessKeyIn) {
        s3Obj = s3ObjIn;
        accessKeyId = accessKeyIdIn;
        secretAccessKey = secretAccessKeyIn;

        $('#load-budget').click(function () {
            refresh();
        });

        $('#project').click(function () {
            project();
        });

        refresh();
    };

}

module.exports = HomeController;