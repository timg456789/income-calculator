# Income Calculator

Responsible for projecting net income with the following transaction types:

 1. biweekly income
 2. weekly recurring expenses
 3. monthly recurring expenses
 4. one-time expenses
 
 
Starting with an income configuration with a name and amount for each transction type, a projection is performed from a start and end date. The result of the projection is a detailed breakdown of:

 - name
 - amount
 - type: income or expense
 - date
 
In only **three minutes** one can enter their income and expense transactions to project a budget for an entire year through weekly, monthly and one time expenses. From here one can review the detailed income and expense transactions or view them in a calendar report which summarizes weekly totals and monthly net income.

Weekly totals only take into account the days in the week for the month being considered. For example if a week spans across september and october, portions of the week's transactions will be in september and portions of the week's transactions will be in october. No transaction in the week will overlap and be repeated in both september and october. This methodology supports transparent monthly totals.

## Unsupported Expense Schedules

### Greater Than One Month
Expense schedules that are over a month are best handled by breaking down the expense to a month or as a one-time expense. For example vehicle registration is done once per year, this should be listed as a one-time expense per year. Oil changes can vary and can be broken down either by week or by month. For example if an oil change is needed once every two months and costs $90, budget $45 per month. Handling expenses this way reinforces good saving habits by avoiding incurring the full cost all at once.

### Interest Bearing Expenses
Currently the best option is to use an external payment calculator and plug in the first payment amount as recurring weekly or monthly. One can even document the precise amounts as one-time payments.

## Glossary

### Accrue
To receive income.

### Biweekly Income
Income accrued on a 14 day interval determined by an initial start date. Biweekly income is detailed in docs/README.md under the **Income - Accruals** section.

### Day
More formally known as a `UTC day` is a constant 86,400 seconds or 86,400,000 milliseconds.

### Monthly Recurring Expense (MRE)
An expense that is incurred every calendar month on a specific day. MRE's are incurred on the 28th by default.

### Net Income
Income after expenses.

### Transaction
The action of incurring an expense or accruing income.

### Weekly Recurring Expense (WRE)
An expense that is incurred every seven days. WRE's are incurred on Friday's by default.

### Incur
Payment of goods or services.

## Roadmap

Two features I want from usage:

1. ability to override the default date for monthly recurring expenses e.g. what's the expense spread like if insurance is paid on the 25th?
2. abiliity to view net income across multiple months e.g what's my yearly net income?

Before deliver I want is to nail down my process, then deploy it in a REST API. I want the API to be able to scale massively and be highly reliable. Then I will just build a few HTML pages to connect to that API in a rock solid web server. I'm talking like static content for the web server. Effectively just a CDN would be optimal. No fragile web server architecture. Instead I want durable microservices.