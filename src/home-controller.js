function HomeController() {

    var cal = require('income-calculator/src/calendar');
    var $ = require('jquery');

    this.init = function () {
        loadDateInput('#start-year', '#start-month', '#start-day');
        loadDateInput('#end-year', '#end-month', '#end-day');
    };

    function loadDateInput(yearTarget, monthTarget, dayTarget) {
        loadYears(yearTarget);
        loadMonths(monthTarget);
        listenForDateChange(yearTarget, monthTarget, dayTarget);
        $(yearTarget).change();
        $(dayTarget).val(new Date().getDate());
    }

    function loadYears(target) {
        var startYear = new Date().getFullYear();
        for (var year = startYear; year < startYear + 10; year++) {
            $(target).append('<option value="' + year + '">' + year + '</option>');
        }
    }

    function loadMonths(target) {
        for (var month = 0; month < cal.MONTHS_IN_YEAR; month++) {
            $(target).append(
                '<option value="' + month + '">' +
                cal.MONTH_NAME_ABBRS[month] +
                '</option>');
        }
    }

    function loadDays(target, endDay) {
        for (var day = 1; day < endDay + 1; day++) {
            $(target).append('<option value="' + day + '">' + day + '</option>');
        }
    }

    function listenForDateChange(yearTarget, monthTarget, dayTarget) {

        $(yearTarget).change(function() {
            loadDays(dayTarget,
                getDaysByTarget(yearTarget, monthTarget))
        });

        $(monthTarget).change(function() {
            loadDays(dayTarget,
                getDaysByTarget(yearTarget, monthTarget))

        });

    }

    function getDaysByTarget(yearTarget, monthTarget) {
        return getDays(
            parseInt($(yearTarget).val()),
            parseInt($(monthTarget).val())
        );
    }

    function getDays(year, month) {
        var dt = new Date(year, month + 1);
        dt.setDate(0);
        return dt.getDate();
    }

}

module.exports = HomeController;