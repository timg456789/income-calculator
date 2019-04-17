function HomeController() {
    'use strict';

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
        let data = homeView.getBalanceSheetModel();
        try {
            let response = await dataClient.patch(s3ObjKey, data);
            window.location='./balance-sheet.html'+window.location.search;
        } catch (err) {
            console.log(err);
            log('failure saving settings: ' + JSON.stringify(err, 0, 4));
        }
    }

    async function refresh() {
        try {
            let data = await dataClient.getData();
            homeView.setView(data);
        } catch (err) {
            log(JSON.stringify(err, 0, 4));
        }
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
                    log(JSON.stringify(err, 0, 4));
                });
        });
        $('#account-settings-save-close-button').click(function () {
            let newFileName = $('#budgetName').val().trim();
            dataClient.patch(newFileName,homeView.getBalanceSheetModel())
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
            if (agreedToLicense() && hasCredentials()) {
                save();
            }
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