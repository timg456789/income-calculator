# income-calculator

##Features

- Project bi-weekly income
- Calculate expenses for month
    - Recurring monthly
    - Recurring weekly
    - One time

## Roadmap

I'm going to begin to tackle the monthly expense issue. My recent commit for the master config starts to show the enormous differences between months that have 4 and 5 weeks where weekly expenses are due. It's about 80 calendar days 336 vs 420. That's a difference of 12 weeks. With weekly expenses at 275 that has an effect of 3,300. This is huge and is justification for being the highest priority issue.

In order to solve this problem I'm going to take the opportunity to address two fundamental issues:

1. Lack of UI potential
2. Lack of debugging capabilities

I'm going to output the config into days on a calendar. Each as a debit or credit. This raw low-level highly processed output provides the much needed debugging capabilities along with needed transparency. It's useless if I have tests that pass, without re-inforcing them. I must build confidence in the application. Finally I can just throw (yes literally place with little care) onto a calendar.

The calendar will actually be quite impressive, because it will be a calendar that's also balance sheet! It's very simple, but I've never seen anything like it. I'll add a picture of what I have designed.