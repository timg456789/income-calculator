const test = require('tape');
const YearlyInterest = require('../src/yearly-interest');
const MonthlyInterest = require('../src/monthly-interest');
const yearlyInterest = new YearlyInterest();
const monthlyInterest = new MonthlyInterest();

const YEARLY_SAVINGS = 4680;
const YEARLY_INTEREST = '.08';

test('end of month 1', function(t) {
   t.plan(1);
   var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 1, YEARLY_INTEREST);
   t.equal(monthEnd, 390);
});

test('end of month 2', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 2, YEARLY_INTEREST);
    t.equal(monthEnd, 782.6);
});

test('end of month 3', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 3, YEARLY_INTEREST);
    t.equal(monthEnd, 1177.8173333333334);
});

test('end of month 4', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 4, YEARLY_INTEREST);
    t.equal(monthEnd, 1575.6694488888888);
});

test('end of month 5', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 5, YEARLY_INTEREST);
    t.equal(monthEnd, 1976.1739118814814);
});

test('end of month 6', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 6, YEARLY_INTEREST);
    t.equal(monthEnd, 2379.348404627358);
});

test('end of month 7', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 7, YEARLY_INTEREST);
    t.equal(monthEnd, 2785.2107273248735);
});

test('end of month 8', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 8, YEARLY_INTEREST);
    t.equal(monthEnd, 3193.7787988403725);
});

test('end of month 9', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 9, YEARLY_INTEREST);
    t.equal(monthEnd, 3605.0706574993083);
});

test('end of month 10', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 10, YEARLY_INTEREST);
    t.equal(monthEnd, 4019.104461882637);
});


test('end of month 11', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 11, YEARLY_INTEREST);
    t.equal(monthEnd, 4435.898491628522);
});


test('end of month 12', function(t) {
    t.plan(1);
    var monthEnd = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 12, YEARLY_INTEREST);
    t.equal(monthEnd, 4855.471148239379);
});

test('end of year 1', function(t) {
    t.plan(2);
    var expectedToAddEachYear = yearlyInterest.calcSavings(YEARLY_SAVINGS, 1, YEARLY_INTEREST);
    t.equal(4680, expectedToAddEachYear, 'expected to add each year');

    var expectedMonthly = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 12, YEARLY_INTEREST);
    t.equal(4855.471148239379, expectedMonthly, 'expected to save adding on a monthly basis for one year');
});

test('end of year 2', function(t) {
   t.plan(1);
   var expectedAtEndOfYear2 = yearlyInterest.calcSavings(YEARLY_SAVINGS, 2, YEARLY_INTEREST);
   t.equal(9734.4, expectedAtEndOfYear2);
});

test('end of year 3', function(t) {
    t.plan(1);
    var expectedAtEndOfYear3 = yearlyInterest.calcSavings(YEARLY_SAVINGS, 3, YEARLY_INTEREST);
    t.equal(15193.152, expectedAtEndOfYear3);
});

test('end of year 4', function(t) {
    t.plan(1);
    t.equal(21088.60416, yearlyInterest.calcSavings(YEARLY_SAVINGS, 4, YEARLY_INTEREST));
});

test('end of year 10 @ 20%', function(t) {
    t.plan(1);
    t.equal(121486.63228416, yearlyInterest.calcSavings(YEARLY_SAVINGS, 10, '.20'));
});

test('end of year 10 @ 15%', function(t) {
    t.plan(1);
    t.equal(95021.40135408679, yearlyInterest.calcSavings(YEARLY_SAVINGS, 10, '.15'));
});

test('end of year 10 @ 10%', function(t) {
    t.plan(2);
    var contributionsOverTenYears = 4680 * 10;
    t.equal(74587.14713268001 - contributionsOverTenYears, 27787.14713268001, 'interest after 10 years');
    t.equal(74587.14713268001, yearlyInterest.calcSavings(YEARLY_SAVINGS, 10, '.10'));
});