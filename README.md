# Income Calculator

Responsible for projecting net income. Net Income calculations are built on three core pieces:

 1. biweekly income
 2. weekly recurring expenses
 3. monthly recurring expenses

## Glossary

### Accrue
To receive income.

### Biweekly Income
Income accrued on a 14 day interval determined by an initial start date. Biweekly income is detailed in docs/README.md under the **Income - Accruals** section.

### Net Income
Income after expenses.

### Monthly Recurring Expense (MRE)
An expense that is incurred every calendar month. MRE's are incurred on the 28th by default.

### Weekly Recurring Expense (WRE)
An expense that is incurred every seven days. WRE's are incurred on Friday's by default.

### Incur
Payment of goods or services.

## Roadmap

I've pretty much solved the UI potential and debugging capability issue in my last commit. The next highest priority issue once those problems are completed is data-entry. I've got the whole back-end ready and waiting in musical octo train which is test-driven with AWS dynamo db and continuous deployment so I'll be boosting through that part with perfect documentation on the technical components!