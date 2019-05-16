const AccountSettingsController = require('./account-settings-controller');
const CalendarView = require('../calendar-view');
const DataClient = require('../data-client');
const Util = require('../util');

function BudgetCalendarController() {
    'use strict';
    let settings;

    async function load() {
        try {
            let dataClient = new DataClient(settings);
            let data = await dataClient.getData();
            for (let mre of data.monthlyRecurringExpenses) {
                mre.date = new Date(mre.date);
            }
            data.biWeeklyIncome.date = new Date(data.biWeeklyIncome.date);

            var year = new Date().getUTCFullYear();
            var month = new Date().getUTCMonth();
            var start = new Date(Date.UTC(year, month, 1));
            var end = new Date(start.getTime());
            end.setUTCMonth(end.getUTCMonth() + 1);
            CalendarView.build(year, month);
            CalendarView.load(data, [], start, end);
        } catch (err) {
            Util.log(err);
        }
    }
    this.init = function (settingsIn) {
        settings = settingsIn;
        new AccountSettingsController().init(settings);
        load();
    };
}

module.exports = BudgetCalendarController;