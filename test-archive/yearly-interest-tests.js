const test = require('tape');
const YearlyInterest = require('../src/yearly-interest');
const MonthlyInterest = require('../src/monthly-interest');
const yearlyInterest = new YearlyInterest();
const monthlyInterest = new MonthlyInterest();

const YEARLY_SAVINGS = 4680;
const YEARLY_INTEREST = '.08';

// Original
// 90 dollars saved per week (10 % of yearly income)
// 4680 year 1 = no interest
// 9734 year 2 = interest paid on year start at 8%
// 	4680
// 	374 interest on 4,680 @ 8%
// 	4680
// 15192 year 3
// 	9734
// 	778 interest on 9734 @ 8%
// 	4680
// 21087 year 4
// 	15192
// 	1215 interest on 15192 @ 8%
// 	4680

test('end of year 1', function(t) {
    t.plan(2);
    var expectedToAddEachYear = yearlyInterest.calcSavings(YEARLY_SAVINGS, 1, YEARLY_INTEREST);
    t.equal(4680, expectedToAddEachYear, 'expected to add each year');

    var expectedMonthly = monthlyInterest.calcSavings(YEARLY_SAVINGS/12, 1, YEARLY_INTEREST/12);
    t.equal(4680, expectedToAddEachYear, 'expected to save adding on a monthly basis for one year');
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

/*
    ugh idk, at 10 years the interest and amount both become substantial.
    the problem is it's not even accounting for inflation between 3.5 and 7% conservatively.

    really things change at around 15%. but fuck how do you reliably get 15% returns?
    after 5 years in stocks I just once got 20%, and changed the mix so that certainly will not happen again,
    and that's consdiered extremely good coming up from a bad year so it's not in any way consistent as required.
 */
test('end of year 10 @ 10%', function(t) {
    t.plan(2);
    var contributionsOverTenYears = 4680 * 10;
    t.equal(74587.14713268001 - contributionsOverTenYears, 27787.14713268001, 'interest after 10 years');
    t.equal(74587.14713268001, yearlyInterest.calcSavings(YEARLY_SAVINGS, 10, '.10'));
});