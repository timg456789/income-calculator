const DataClient = require('../data-client');
const Util = require('../util');

function AccountSettingsController() {
    'use strict';
    let bucket;
    let s3ObjKey;
    let accessKeyId;
    let secretAccessKey;
    let dataClient;
    let view;
    async function save() {
        let data = view.getModel();
        try {
            let response = await dataClient.patch(s3ObjKey, data);
            window.location=window.location;
        } catch (err) {
            Util.log(err);
        }
    }
    this.init = function (settings, viewIn) {
        view = viewIn;
        bucket = settings.s3Bucket;
        s3ObjKey = settings.s3ObjectKey;
        accessKeyId = settings.pub;
        secretAccessKey = settings.priv;
        dataClient = new DataClient(settings);
        $('#save').click(function () {
            if (Util.agreedToLicense()) {
                save();
            }
        });
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
                    downloadLink.setAttribute('download', Util.getParameterByName('data'));
                    if (document.createEvent) {
                        var event = document.createEvent('MouseEvents');
                        event.initEvent('click', true, true);
                        downloadLink.dispatchEvent(event);
                    }
                    else {
                        downloadLink.click();
                    }
                })
                .catch(err => { Util.log(err); });
        });
        $('#account-settings-save-close-button').click(function () {
            let newFileName = $('#budgetName').val().trim();
            dataClient.patch(newFileName, view.getModel())
                .then(data => {
                    let url = Util.updateQueryStringParameter(location.href, 'data', newFileName);
                    url = Util.updateQueryStringParameter(url, 'pub', $('#awsAccessKeyId').val().trim());
                    url = Util.updateQueryStringParameter(url, 'priv', $('#awsSecretAccessKey').val().trim());
                    url = Util.updateQueryStringParameter(url, 'agreedToLicense', Util.agreedToLicense());
                    window.location.href = url;
                })
                .catch(err => { Util.log(err); });
        });
        $('#awsBucket').val(bucket);
        $('#budgetName').val(s3ObjKey);
        $('#awsAccessKeyId').val(settings.pub);
        $('#awsSecretAccessKey').val(settings.priv);
        $('#acceptLicense').prop('checked', settings.agreedToLicense);
    };
}

module.exports = AccountSettingsController;