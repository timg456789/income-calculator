const calendarView = require('./calendar-view');
const homeView = require('./home-view');
const DataClient = require('./data-client');

function HomeController() {
    'use strict';

    let bucket;
    let s3ObjKey;
    let accessKeyId;
    let secretAccessKey;
    let dataClient;

    function log(error) {
        console.log(error);
        $('#debug-console').append('<div>' + error + '</div>');
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

    async function save() {
        if (!s3ObjKey) {
            s3ObjKey = guid();
        }
        let data = homeView.getModel();
        try {
            let response = await dataClient.patch(s3ObjKey, data);
            var url = updateQueryStringParameter(location.href, 'data', s3ObjKey);
            url = updateQueryStringParameter(url, 'agreedToLicense', agreedToLicense());
            $('#output').append(`<p>You can view this budget at anytime by viewing this <a href="${url}">${url}</a>.</p>`);
            $('#months-container').prepend(
                `<div id="calendar-legend"><strong>Legend</strong><br />
                    <span class="transaction-view expense income" title="income">Income</span><br />
                    <span class="transaction-view expense" title="budgeted expense">Expense</span>
                </div>`
            );
        } catch (err) {
            console.log(err);
            log('failure saving settings: ' + JSON.stringify(err, 0, 4));
        }
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
        $('#input-form').hide();
        $('#output').empty();

        if (hasCredentials()) {
            save();
        }
    }

    async function refresh() {
        try {
            let data = await dataClient.getData();
            homeView.setView(data);
        } catch (err) {
            console.log('set view error');
            log(err);
        }
    }
    
    function initGroup(name) {
        $('#add-new-' + name).click(function () {
            $('#' + name + '-input-group').append(homeView.getTransactionView({}, name));
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
            dataClient.getData()
                .then(data => {
                    let downloadLink = document.createElement('a');
                    downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, 0, 4)));
                    downloadLink.setAttribute('download', getParameterByName('data'));
                    console.log('downloading');
                    if (document.createEvent) {
                        var event = document.createEvent('MouseEvents');
                        event.initEvent('click', true, true);
                        downloadLink.dispatchEvent(event);
                    }
                    else {
                        downloadLink.click();
                    }
                })
                .catch(err => {
                    console.log(err);
                    log(JSON.stringify(err, 0, 4));
                });
        });
        $('#account-settings-save-close-button').click(function () {
            let newFileName = $('#budgetName').val().trim();
            dataClient.patch(newFileName,homeView.getModel())
                .then(data => {
                    let url = updateQueryStringParameter(location.href, 'data', newFileName);
                    url = updateQueryStringParameter(url, 'pub', $('#awsAccessKeyId').val().trim());
                    url = updateQueryStringParameter(url, 'priv', $('#awsSecretAccessKey').val().trim());
                    url = updateQueryStringParameter(url, 'agreedToLicense', agreedToLicense());
                    window.location.href = url;
                })
                .catch(err => {
                    log(err);
                    log('failure saving settings: ' + JSON.stringify(err, 0, 4));
                })
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