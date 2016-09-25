const $ = require('jquery');
const cal = require('income-calculator/src/calendar');
var HomeController = require('./home-controller');
var homeController = new HomeController();

$(document).ready(function() {

    $('#budget-url').val('https://s3.amazonaws.com/income-calculator/budget.json');
    $.getJSON($('#budget-url').val().trim(), {}, function (data) {
        homeController.init(data);
    });

});

