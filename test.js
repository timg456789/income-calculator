var test = require('tape');
var calc = require('./calculator');

test('define failure', function (t) {
    t.plan(1);
    t.ok(false);
});

test('define success', function (t) {
    t.plan(1);
    t.ok(true);
});
