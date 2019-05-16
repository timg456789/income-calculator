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
    async function save() {
        if (!s3ObjKey) {
            s3ObjKey = Util.guid();
        }
        let data = homeView.getModel();
        try {
            let response = await dataClient.patch(s3ObjKey, data);
            var url = Util.updateQueryStringParameter(location.href, 'data', s3ObjKey);
            url = Util.updateQueryStringParameter(url, 'agreedToLicense', Util.agreedToLicense());
            $('#output').append(`<p>You can view this budget at anytime by viewing this <a href="${url}">${url}</a>.</p>`);
            $('#months-container').prepend(
                `<div id="calendar-legend"><strong>Legend</strong><br />
                    <span class="transaction-view expense income" title="income">Income</span><br />
                    <span class="transaction-view expense" title="budgeted expense">Expense</span>
                </div>`
            );
        } catch (err) {
            Util.log(err);
        }
    }
    async function refresh() {
        try {
            let data = await dataClient.getData();
            homeView.setView(data);
        } catch (err) {
            Util.log(err);
        }
    }
    function initGroup(name) {
        $('#add-new-' + name).click(function () {
            $('#' + name + '-input-group').append(homeView.getTransactionView({}, name));
        });
    }
    this.init = function (settings) {
        bucket = settings.s3Bucket;
        s3ObjKey = settings.s3ObjectKey;
        accessKeyId = settings.pub;
        secretAccessKey = settings.priv;
        dataClient = new DataClient(settings);
        new AccountSettingsController().init(settings, homeView);
        initGroup('monthly');
        initGroup('weekly');
        if (s3ObjKey) {
            refresh();
        }
    };
}
module.exports = HomeController;