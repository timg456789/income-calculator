function CalendarAggregator() {

    const cal = require('./calendar');

    function getWeekStartForMonth(time) {
        var date = new Date(time);
        var startWeekDate = date.getDate() - date.getDay();
        if (startWeekDate < 1) {
            startWeekDate = 1;
        }
        date.setDate(startWeekDate)
        return date;
    }

    this.getWeeklyTotals = function(breakdown) {
        var weeklyTotals = [];
        var i;
        var week = [];
        var item;
        var lastStartWeek = getWeekStartForMonth(breakdown[0].date.getTime());
        var currentStartWeek;

        for (i = 0; i < breakdown.length; i++) {
            item = breakdown[i];

            currentStartWeek = getWeekStartForMonth(item.date.getTime());
            console.log(currentStartWeek);

            console.log('last week start:    ' + lastStartWeek.getDate());
            console.log('current week start: ' + currentStartWeek.getDate())
            if (lastStartWeek.getDate() !== currentStartWeek.getDate()) {
                weeklyTotals.push(week);
                lastStartWeek = currentStartWeek;
            }

            /*
            if (lastStartWeek && lastStartWeek.getDate() !== currentStartWeek.getDate()){
                week = []
            }*/

            //console.log(item.date);
/*
            var startWeek = new Date(item.date.getTime());
            console.log('start: ' + startWeek);

            var startOfNextWeek = new Date(item.date.getTime());
            var startOfNextWeekDate =
                startWeek.getDate() - startWeek.getDay() + cal.DAYS_IN_WEEK;
            startOfNextWeek.setDate(startOfNextWeekDate);
            if (startOfNextWeek.getMonth() !== startWeek.getMonth()) {
                startOfNextWeek.setDate(0);
            }*/

            //console.log('end:   ' + startOfNextWeek);

            //start: Sun Sep 25 2016 00:00:00 GMT+0000 (Coordinated Universal Time)
            //end: Sun Oct 02 2016 00:00:00 GMT+0000 (Coordinated Universal Time)

        }

        weeklyTotals.push(week);

        return weeklyTotals;
    };

}

module.exports = CalendarAggregator;