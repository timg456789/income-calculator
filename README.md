# income-calculator

Features:

- Project bi-weekly income
- Calculate expenses for month
    - Recurring monthly
    - Recurring weekly
    - One time
    
I can't yet justify projecting expenses beyond one month, so I have listed them as calculations. Technically the weekly expenses **are** capable of projecting, but only for one month. This limited expense projection feature is documented with expense-test.

I'm holding back here, because of concerns with the interface not being suitable for debugging or verifying the calculations. There is so much work done, and it really doesn't matter if all tests are passing. Each projection is unique and the values need to be justified.

My thoughts to address this is to tweak the NetIncome function to return a list of named debits and credits. The result could easily be debugged by taking that list into excel, a calculator, or pen and paper. Of course if you want to project out, say 20 years, you are going to have to have some faith. But that faith needs to be justified with larger proven projections of say 1 year. Then it's not so much of a jump to be about 20x that. Then breaking those tests by expecting yearly expenses like taxes to be included. Then further breaking it with bi-yearly expenses like vehicle registration!