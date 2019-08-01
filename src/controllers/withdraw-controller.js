const DataClient = require('../data-client');
const Moment = require('moment');
const Util = require('../util');
function WithdrawController() {
    'use strict';
    let dataClient;
    let settings;
    async function withdraw(amount) {
        try {
            let dataClient = new DataClient(settings);
            let data = await dataClient.getData();
            let cashAsset = data.assets.find(x => x.name.toLowerCase() === "cash");
            if (!cashAsset) {
                cashAsset = {name: 'Cash', sharePrice: '1', 'shares': '0'};
            }
            cashAsset.shares = Util.subtract(cashAsset.shares, amount);
            await dataClient.patch(settings.s3ObjectKey, {assets: data.assets});
            $('#submit-transfer').prop('disabled', false);
            $('#transfer-amount').val('0.00');
            $('#message-container').html(`<div class="alert alert-success" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <p class="mb-0">Withdrawal successful. New cash Balance: ${cashAsset.shares}</p>
            </div>`);
        } catch (err) {
            Util.log(err);
        }
    }
    async function initAsync() {
        $('#submit-transfer').click(function() {
            $('#submit-transfer').prop('disabled', true);
            withdraw($('#transfer-amount').val().trim());
        });
    }
    this.init = function (settingsIn) {
        settings = settingsIn;
        dataClient = new DataClient(settings);
        initAsync()
            .catch(err => { Util.log(err); });
    };
}

module.exports = WithdrawController;