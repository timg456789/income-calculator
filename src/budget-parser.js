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