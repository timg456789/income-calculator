const $ = require('jquery');
var HomeController = require('./home-controller');
var homeController = new HomeController();

function getParameterByName(name, url) {
    'use strict';

    url = location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function () {
    'use strict';

    var s3ObjectKey = 'budget.json';
    var optionalOverride = getParameterByName('data');
    if (optionalOverride) {
        s3ObjectKey = optionalOverride;
    }

    var pub = getParameterByName('pub');
    var priv = getParameterByName('priv');

    homeController.init(s3ObjectKey, pub, priv);
    // I'm working on this now. I should probably hold off, but I want to start working towards this.
    /*var address = $('#bitcoin-input').val().trim();
    var url = 'https://blockchain.info/address/' + address + '?format=json';
    $.getJSON(address, function (data) {
        $('#header').append('<div>Bitcoin Balance: ' + data.final_balance + '</div>');
    });*/

    $('.alert-dismissible > button.close').click(function () {
        $(this).parent().remove();
    });
});
