const homeView = require('../home-view');
const DataClient = require('../data-client');
const AccountSettingsController = require('./account-settings-controller');
const Util = require('../util');
function HomeController() {
    'use strict';
    let bucket;
    let s3ObjKey;
    let accessKeyId;
    let secretAccessKey;
    let dataClient;
    async function refresh() {
        try {
            let data = await dataClient.getData();
            homeView.setView(data);
        } catch (err) {
            Util.log(err);
        }
    }
    this.init = function (settings) {
        bucket = settings.s3Bucket;
        s3ObjKey = settings.s3ObjectKey;
        accessKeyId = settings.pub;
        secretAccessKey = settings.priv;
        dataClient = new DataClient(settings);
        new AccountSettingsController().init(settings, homeView);
        $('#add-new-monthly').click(function () {
            $(this).hide();
            $('.new-monthly-container').prepend(homeView.getEditableTransactionView('monthly'));
        });
        $('#add-new-weekly').click(function () {
            $(this).hide();
            $('.new-weekly-container').prepend(homeView.getEditableTransactionView('weekly'));
        });
        if (s3ObjKey) {
            refresh();
        }
    };
}
module.exports = HomeController;