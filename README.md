# Income Calculator

Responsible for projecting net income. Net Income calculations are built on four core pieces:

 1. biweekly income
 2. weekly recurring expenses
 3. monthly recurring expenses
 4. one-time expenses

These core pieces provide a list of expenses incurred and income accruals with:

 1. name
 2. amount
 3. type: income or expense
 4. date
 
This is essentially a system of debits (expenses) and credits(accruals). It provides complete transparency into the projections. With a breakdown of each type of transaction, the transactions get grouped by week (for the month), then month (for weeks in the month). This allows a budget to be put onto a calendar with totals for each week and a grand total for the month. Groups are exclusive for the month. When a week spans two months, some transactions will be shown in the first part of the week for one month and the rest in the second part of the week for the following month. Transaction exclusivity for a week, prevents overlap for the week and allows totals to be made for a month, which is the core of a budget. This allows the groupings to continually be accumulated even into a yearly total without any historical knowledge.

## Glossary

### Accrue
To receive income.

### Biweekly Income
Income accrued on a 14 day interval determined by an initial start date. Biweekly income is detailed in docs/README.md under the **Income - Accruals** section.

### Day
More formally known as a `UTC day` is a constant 86,400 seconds or 86,400,000 milliseconds.

### Net Income
Income after expenses.

### Monthly Recurring Expense (MRE)
An expense that is incurred every calendar month. MRE's are incurred on the 28th by default.

### Weekly Recurring Expense (WRE)
An expense that is incurred every seven days. WRE's are incurred on Friday's by default.

### Incur
Payment of goods or services.

## Roadmap

I'm one test away from having the data for my calendar. I'm not sure if I want to bother with a UI anymore. I really need to strongly consider what I want from it. Do I want a fancy page to show off my work? Do I want an interface for data entry? Do I want accessibility to support decision making? I strongly need to think about it, otherwise I can't justify any investment in any architecture. I dabbled in what I have and I'm getting nowhere, because I don't know what the needs are.

The more I think about it, I may just say screw the whole web server, setup a static page in s3 then setup three endpoints in api gateway with lambda functions:
 - view config
 - create/update config
 - process config
 
 Sure learning express wouldn't be bad, but I want maximum return on any investment made. I want a solution to my problem, not a solution to any problem. It would really be silly to create a web server for my current needs. The complexity isn't justified.
 
 API gateway gives me security, simplicity, and topped onto s3 reliability. All I need is a little investment to create/deploy the API gateway/lambda stack.
 
 I don't want to manage a web server. I want to write tests and make them pass for processes not web servers. If I use a web server I'm going to have to test it's and that's a shit load of code. I can't provide that level of assurance without sacrificing on the core processes and I'll start to take short-cuts.