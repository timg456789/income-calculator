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

I'm one test away from having the data for my calendar. I'm not sure if I want to bother with a UI anymore. I really need to strongly consider what I want from it. Do I want a fancy page to show off my work? Do I want an interface for data entry? Do I want accessibility to support decision making? I strongly need to think about it, otherwise I can't justify any investment in any architecture. I dabbled in what I have and I'm getting nowhere, because I don't know what the needs are.

The more I think about it, I may just say screw the whole web server, setup a static page in s3 then setup three endpoints in api gateway with lambda functions:
 - view config
 - create/update config
 - process config
 
 Sure learning express wouldn't be bad, but I want maximum return on any investment made. I want a solution to my problem, not a solution to any problem. It would really be silly to create a web server for my current needs. The complexity isn't justified.
 
 API gateway gives me security, simplicity, and topped onto s3 reliability. All I need is a little investment to create/deploy the API gateway/lambda stack.
 
 I don't want to manage a web server. I want to write tests and make them pass for processes not web servers. If I use a web server I'm going to have to test it's and that's a shit load of code. I can't provide that level of assurance without sacrificing on the core processes and I'll start to take short-cuts.