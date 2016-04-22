var balanceSheet = require('./balance-sheet');
var test = require('tape');

test('cash balance at 09:11PM EDT 04/18/2016', function(t) {
    t.plan(3);

    var denom = 100;

    var assets = [821, 138874, 168076];
    var cash = balanceSheet.sum(assets);
    var sumDollars = (cash / denom);

    t.equal(3077.71, sumDollars, 'cash: ' + sumDollars);

    var paid = [
        55000,
        14000
    ];

    var sumPaid = balanceSheet.sum(paid);
    var paidDollars = (sumPaid / denom);

    console.log('paid: ' + paidDollars);

    var expenses = [
        33535,
        10000,
        143200, // dentist
        42000 // taxes
    ];

    var owed = balanceSheet.sum(expenses);
    var expenseDollars = owed / denom;

    t.equal(2287.35, expenseDollars, 'cash owed: ' + expenseDollars);

    var available = cash - owed;

    t.equal(790.36, available / denom, ' expected cash available until next paycheck: ' + available / denom);
});

test('cash balance at 03:32AM EDT 04/22/2016', function(t) {
    t.plan(3);

    var denom = 100;

    var assets = [35821, 138874, 51696];
    var cash = balanceSheet.sum(assets);
    var sumDollars = (cash / denom);

    t.equal(sumDollars, 2263.91, 'cash: ' + sumDollars);

    var paid = [
        55000, // rent
        14000, // utilities - electric, water, garbage, cable, internet
	45800 // taxes
    ];

    var sumPaid = balanceSheet.sum(paid);
    var paidDollars = (sumPaid / denom);

    console.log('paid: ' + paidDollars);

    var expenses = [
        33535, // car insurance
        10000, // phone
        143200, // dentist
    ];

    var owed = balanceSheet.sum(expenses);
    var expenseDollars = owed / denom;

    t.equal(expenseDollars, 1867.35, 'cash owed: ' + expenseDollars);

    var available = cash - owed;

    t.equal(396.56, available / denom, ' expected cash available until next paycheck: ' + available / denom);
});

