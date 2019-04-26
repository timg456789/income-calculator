const BalanceViewModel = require('../balance-view-model');
const AssetViewModel = require('../asset-view-model');
const BondViewModel = require('../bond-view-model');

exports.getModel = function () {
    var model = {};
    model.balances = BalanceViewModel.getModels();
    model.assets = AssetViewModel.getModels();
    model.bonds = BondViewModel.getModels();
    return model;
};