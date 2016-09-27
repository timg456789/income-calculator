function HomeController() {

    var $ = require('jquery');
    const calendarView = require('./calendar-view');
    const homeView = require('./home-view');
    var bucket = 'income-calculator';
    var s3Obj;
    var accessKeyId;
    var secretAccessKey;

    function getS3Params() {
        return {
            Bucket: bucket,
            Key: s3Obj,
        };
    }
    //, ,
    function dataFactory() {
        var AWS = require('aws-sdk');
        AWS.config.update(
            {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                region: 'us-east-1'
            });
        var s3 = new AWS.S3();
        return s3;
    }

    function refresh() {
        dataFactory().getObject(getS3Params(), function (err, data) {
            if (err) {
                log(JSON.stringify(err, 0, 4));
            }
            homeView.setView(JSON.parse(data.Body.toString('utf-8')));
        });
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

    this.init = function (s3ObjIn, accessKeyIdIn, secretAccessKeyIn) {
        s3Obj = s3ObjIn;
        accessKeyId = accessKeyIdIn;
        secretAccessKey = secretAccessKeyIn;

        $('#output').append('<p>Enter your biweekly income and expenses. ' +
            'Then we will show your expenses for the current month on a calendar.</p>');

        $('#load-budget').click(function () {
            refresh();
        });

        $('#project').click(function () {
            project();
        });

        refresh();
    };

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

        var s3 = dataFactory();
        var options = {};
        options.Bucket = bucket;
        options.Key = guid() + '.json';
        options.Body = JSON.stringify(homeView.getModel(), 0, 4);
        s3.upload(options, function (err, data) {
            if (err) {
                log(JSON.stringify(err, 0, 4));
            }

            var url = window.location.href + "&data=" + options.Key;
            $('#output').append('<p>You can view this budget at anytime by viewing this ' +
                '<a href="' + url +'">' + url + '</a>.' +
                '</p>');
        });
    }

    function checkNet() {
        var displayedNet = parseInt($('#month-net-header-value').html());
        var expectedNet = 2545;
        if (displayedNet !== expectedNet) {
            log('expected net of ' + expectedNet + ', but was: ' + displayedNet);
        }
    }

    function log(error) {
        console.log(error);
        $('#debug-console').append('<div>' + error + '</div>');
    }

}

module.exports = HomeController;