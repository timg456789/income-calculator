// Used to detect and convert iso strings to date objects.
// Allows a JS object with a date property to be serialized
// and deserialized. Normally this breaks, since the date is
// serialized to a string, but never deserialized to a date.
exports.parse = function (budget) {
    return JSON.parse(budget, function (k,v) {

        if (v.length === 24) {
            var endLetter = v.toLowerCase().substr(23, 1);
            if (endLetter === 'z') {
                return new Date(v);
            }
        }

        return v;
    });
}