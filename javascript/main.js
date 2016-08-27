const EXAMPLE_BUDGET = [
    {
        "items": [
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-02T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-09-02T00:00:00.000Z",
                        "type": "income"
                    }
                ],
                "net": 126000
            },
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-09T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": -7500
            },
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-16T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-09-16T00:00:00.000Z",
                        "type": "income"
                    },
                    {
                        "name": "taxes",
                        "amount": 40000,
                        "date": "2016-09-17T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": 86000
            },
            {
                "items": [
                    {
                        "name": "utilities",
                        "amount": 10000,
                        "date": "2016-09-20T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-23T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": -17500
            },
            {
                "items": [
                    {
                        "name": "rent",
                        "amount": 55000,
                        "date": "2016-09-28T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-09-30T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-09-30T00:00:00.000Z",
                        "type": "income"
                    }
                ],
                "net": 71000
            }
        ],
        "net": 258000
    },
    {
        "items": [
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-10-07T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": -7500
            },
            {
                "items": [
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-10-14T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-10-14T00:00:00.000Z",
                        "type": "income"
                    }
                ],
                "net": 126000
            },
            {
                "items": [
                    {
                        "name": "utilities",
                        "amount": 10000,
                        "date": "2016-10-20T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-10-21T00:00:00.000Z",
                        "type": "expense"
                    }
                ],
                "net": -17500
            },
            {
                "items": [
                    {
                        "name": "rent",
                        "amount": 55000,
                        "date": "2016-10-28T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "food",
                        "amount": 7500,
                        "date": "2016-10-28T00:00:00.000Z",
                        "type": "expense"
                    },
                    {
                        "name": "biweekly income",
                        "amount": 133500,
                        "date": "2016-10-28T00:00:00.000Z",
                        "type": "income"
                    }
                ],
                "net": 71000
            }
        ],
        "net": 172000
    }
];

var months = EXAMPLE_BUDGET.length;
var weeksInFirstMonth = EXAMPLE_BUDGET[0].items.length;
var itemsInFirstWeekOfFirstMonth = EXAMPLE_BUDGET[0].items[0].items.length;

console.log(months);
console.log(weeksInFirstMonth);
console.log(itemsInFirstWeekOfFirstMonth);
