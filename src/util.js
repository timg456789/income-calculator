exports.log = function (error) {
    console.log(error);
    console.log(JSON.stringify(error, 0, 4));
    $('#debug-console').append('<div>' + error + '</div>');
};
exports.getParameterByName = function (name) {
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
};
exports.updateQueryStringParameter = function (uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1
        ? "&"
        : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
};
exports.agreedToLicense = function () {
    return $('#acceptLicense').is(':checked');
};
exports.format = function(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};
exports.settings = function() {
    let settings = {};
    let optionalOverride = exports.getParameterByName('data');
    if (optionalOverride) {
        settings.s3ObjectKey = optionalOverride;
    }
    settings.pub = exports.getParameterByName('pub');
    settings.priv = exports.getParameterByName('priv');
    settings.s3Bucket = exports.getParameterByName('s3Bucket');
    settings.agreedToLicense = exports.getParameterByName('agreedToLicense') === 'true';
    return settings;
};