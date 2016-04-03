var cal = require('./calendar');

exports.biweeklyRate = 1600;

exports.recurringExpensesApril2016 = 1775.35;

exports.recurringIncomeApril2016 = 4800
exports.recurringIncomeMay2016 = 3200

exports.monthlyExpenses = [
    {
        name: "rent",
        amount: 550
    },
    {
        name: "carInsurance",
        amount: 335.35
    },
    {
        name: "utilities",
        amount: 165
    },
    {
        name: "phone",
        amount: 100
    }
];

exports.weeklyExpenses = [
    {
        name: "car",
        amount: 125
    }
];

exports.aprilExpensesConfig = {
    monthlyExpenses: exports.monthlyExpenses,
    weeklyExpenses: exports.weeklyExpenses,
    dayOfWeek: cal.FRIDAY,
    month: cal.APRIL,
    year: 2016
};

exports.mayExpensesConfig = {
    monthlyExpenses: exports.monthlyExpenses,
    weeklyExpenses: exports.weeklyExpenses,
    dayOfWeek: cal.FRIDAY,
    month: cal.MAY,
    year: 2016
};

exports.aprilIncomeConfig = function () {
    var base = createMonthIncomeConfig();
    base.startTime = new Date(2016, 2, 26).getTime();
    base.endTime = new Date(2016, 3, 30).getTime();
    return base;
}

exports.mayIncomeConfig = function () {
    var base = createMonthIncomeConfig();
    base.startTime = new Date(2016, 4, 1).getTime();
    base.endTime = new Date(2016, 5, 0).getTime();
    return base;
};

function createMonthIncomeConfig() {
    return {
        calendarConfig: cal.BIWEEKLY_CALENDAR_CONFIG,
        rate: exports.biweeklyRate,
    }
}