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

### Annual Percentage Rate (APR)
The APR represents the amount of interest accrued on a yearly period. An APR may be converted to be used in other periods by simply dividing **down to a montly period**. After a monthhly period e.g. weekly or daily interest is generally not accrued and based upon a monthly period then the number of weeks or days in that period.

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

## Future Work

What is my ideal payment?

From a ROI point of view it's 182. Other than that it'd be what I can afford. Really you'd have to look at interest. To get granular you'd need to look at the differences closer. A difference in payoff dates may not be that much, and you need to look at total interest to see the true difference in value at a smaller time scale.

loan.totalAmount = 19000;
loan.DayOfTheWeek = cal.FRIDAY;
loan.rate = '.19720';

monthly payment: 314 payoff date: "2047-03-22T00:00:00.000Z" total interest: 94198
monthly payment: 318 payoff date: "2037-12-25T00:00:00.000Z" total interest: 60641
monthly payment: 322 payoff date: "2034-12-22T00:00:00.000Z" total interest: 50043
monthly payment: 327 payoff date: "2033-02-11T00:00:00.000Z" total interest: 43769
monthly payment: 331 payoff date: "2031-10-24T00:00:00.000Z" total interest: 39381
monthly payment: 335 payoff date: "2030-10-11T00:00:00.000Z" total interest: 36048
monthly payment: 340 payoff date: "2029-12-14T00:00:00.000Z" total interest: 33387
monthly payment: 344 payoff date: "2029-04-06T00:00:00.000Z" total interest: 31190
monthly payment: 348 payoff date: "2028-09-01T00:00:00.000Z" total interest: 29331
monthly payment: 353 payoff date: "2028-02-18T00:00:00.000Z" total interest: 27729
monthly payment: 357 payoff date: "2027-09-03T00:00:00.000Z" total interest: 26327
monthly payment: 361 payoff date: "2027-04-09T00:00:00.000Z" total interest: 25087
monthly payment: 366 payoff date: "2026-11-20T00:00:00.000Z" total interest: 23979
monthly payment: 370 payoff date: "2026-07-17T00:00:00.000Z" total interest: 22981
monthly payment: 374 payoff date: "2026-03-27T00:00:00.000Z" total interest: 22076
monthly payment: 379 payoff date: "2025-12-12T00:00:00.000Z" total interest: 21250
monthly payment: 383 payoff date: "2025-09-05T00:00:00.000Z" total interest: 20492
monthly payment: 387 payoff date: "2025-06-06T00:00:00.000Z" total interest: 19793
monthly payment: 392 payoff date: "2025-03-14T00:00:00.000Z" total interest: 19147
monthly payment: 396 payoff date: "2024-12-27T00:00:00.000Z" total interest: 18546
monthly payment: 401 payoff date: "2024-10-18T00:00:00.000Z" total interest: 17986
monthly payment: 405 payoff date: "2024-08-09T00:00:00.000Z" total interest: 17463
monthly payment: 409 payoff date: "2024-05-31T00:00:00.000Z" total interest: 16973
monthly payment: 414 payoff date: "2024-03-29T00:00:00.000Z" total interest: 16512
monthly payment: 418 payoff date: "2024-02-02T00:00:00.000Z" total interest: 16078
monthly payment: 422 payoff date: "2023-12-08T00:00:00.000Z" total interest: 15668
monthly payment: 427 payoff date: "2023-10-13T00:00:00.000Z" total interest: 15281
monthly payment: 431 payoff date: "2023-08-25T00:00:00.000Z" total interest: 14914
monthly payment: 435 payoff date: "2023-07-07T00:00:00.000Z" total interest: 14565
monthly payment: 440 payoff date: "2023-05-26T00:00:00.000Z" total interest: 14234
monthly payment: 444 payoff date: "2023-04-07T00:00:00.000Z" total interest: 13919
monthly payment: 448 payoff date: "2023-02-24T00:00:00.000Z" total interest: 13618
monthly payment: 453 payoff date: "2023-01-13T00:00:00.000Z" total interest: 13331
monthly payment: 457 payoff date: "2022-12-09T00:00:00.000Z" total interest: 13057
monthly payment: 461 payoff date: "2022-10-28T00:00:00.000Z" total interest: 12794
monthly payment: 466 payoff date: "2022-09-23T00:00:00.000Z" total interest: 12543
monthly payment: 470 payoff date: "2022-08-19T00:00:00.000Z" total interest: 12302
monthly payment: 474 payoff date: "2022-07-22T00:00:00.000Z" total interest: 12071
monthly payment: 479 payoff date: "2022-06-17T00:00:00.000Z" total interest: 11848
monthly payment: 483 payoff date: "2022-05-13T00:00:00.000Z" total interest: 11634
monthly payment: 487 payoff date: "2022-04-15T00:00:00.000Z" total interest: 11429
monthly payment: 492 payoff date: "2022-03-18T00:00:00.000Z" total interest: 11230
monthly payment: 496 payoff date: "2022-02-18T00:00:00.000Z" total interest: 11039
monthly payment: 501 payoff date: "2022-01-21T00:00:00.000Z" total interest: 10855
monthly payment: 505 payoff date: "2021-12-24T00:00:00.000Z" total interest: 10677
monthly payment: 509 payoff date: "2021-12-03T00:00:00.000Z" total interest: 10505
monthly payment: 514 payoff date: "2021-11-05T00:00:00.000Z" total interest: 10339
monthly payment: 518 payoff date: "2021-10-15T00:00:00.000Z" total interest: 10178
monthly payment: 522 payoff date: "2021-09-17T00:00:00.000Z" total interest: 10022
monthly payment: 527 payoff date: "2021-08-27T00:00:00.000Z" total interest: 9871
monthly payment: 531 payoff date: "2021-08-06T00:00:00.000Z" total interest: 9725
monthly payment: 535 payoff date: "2021-07-16T00:00:00.000Z" total interest: 9584
monthly payment: 540 payoff date: "2021-06-25T00:00:00.000Z" total interest: 9446
monthly payment: 544 payoff date: "2021-06-04T00:00:00.000Z" total interest: 9313
monthly payment: 548 payoff date: "2021-05-14T00:00:00.000Z" total interest: 9183
monthly payment: 553 payoff date: "2021-04-23T00:00:00.000Z" total interest: 9058
monthly payment: 557 payoff date: "2021-04-09T00:00:00.000Z" total interest: 8935
monthly payment: 561 payoff date: "2021-03-19T00:00:00.000Z" total interest: 8817
monthly payment: 566 payoff date: "2021-03-05T00:00:00.000Z" total interest: 8701
monthly payment: 570 payoff date: "2021-02-12T00:00:00.000Z" total interest: 8588
monthly payment: 574 payoff date: "2021-01-29T00:00:00.000Z" total interest: 8479
monthly payment: 579 payoff date: "2021-01-08T00:00:00.000Z" total interest: 8372
monthly payment: 583 payoff date: "2020-12-25T00:00:00.000Z" total interest: 8268
monthly payment: 587 payoff date: "2020-12-11T00:00:00.000Z" total interest: 8167
monthly payment: 592 payoff date: "2020-11-27T00:00:00.000Z" total interest: 8068
monthly payment: 596 payoff date: "2020-11-06T00:00:00.000Z" total interest: 7972
monthly payment: 601 payoff date: "2020-10-23T00:00:00.000Z" total interest: 7878
monthly payment: 605 payoff date: "2020-10-09T00:00:00.000Z" total interest: 7786
monthly payment: 609 payoff date: "2020-09-25T00:00:00.000Z" total interest: 7697
monthly payment: 614 payoff date: "2020-09-11T00:00:00.000Z" total interest: 7609
monthly payment: 618 payoff date: "2020-08-28T00:00:00.000Z" total interest: 7524
monthly payment: 622 payoff date: "2020-08-14T00:00:00.000Z" total interest: 7440
monthly payment: 627 payoff date: "2020-08-07T00:00:00.000Z" total interest: 7359
monthly payment: 631 payoff date: "2020-07-24T00:00:00.000Z" total interest: 7279
monthly payment: 635 payoff date: "2020-07-10T00:00:00.000Z" total interest: 7201
monthly payment: 640 payoff date: "2020-06-26T00:00:00.000Z" total interest: 7125
monthly payment: 644 payoff date: "2020-06-19T00:00:00.000Z" total interest: 7050
monthly payment: 648 payoff date: "2020-06-05T00:00:00.000Z" total interest: 6977
monthly payment: 653 payoff date: "2020-05-22T00:00:00.000Z" total interest: 6906
monthly payment: 657 payoff date: "2020-05-15T00:00:00.000Z" total interest: 6836
monthly payment: 661 payoff date: "2020-05-01T00:00:00.000Z" total interest: 6767
monthly payment: 666 payoff date: "2020-04-17T00:00:00.000Z" total interest: 6700
monthly payment: 670 payoff date: "2020-04-10T00:00:00.000Z" total interest: 6634
monthly payment: 674 payoff date: "2020-03-27T00:00:00.000Z" total interest: 6570
monthly payment: 679 payoff date: "2020-03-20T00:00:00.000Z" total interest: 6506
monthly payment: 683 payoff date: "2020-03-13T00:00:00.000Z" total interest: 6444
monthly payment: 688 payoff date: "2020-02-28T00:00:00.000Z" total interest: 6384
monthly payment: 692 payoff date: "2020-02-21T00:00:00.000Z" total interest: 6324
monthly payment: 696 payoff date: "2020-02-07T00:00:00.000Z" total interest: 6265
monthly payment: 701 payoff date: "2020-01-31T00:00:00.000Z" total interest: 6208
monthly payment: 705 payoff date: "2020-01-24T00:00:00.000Z" total interest: 6152
monthly payment: 709 payoff date: "2020-01-10T00:00:00.000Z" total interest: 6096
monthly payment: 714 payoff date: "2020-01-03T00:00:00.000Z" total interest: 6042
monthly payment: 718 payoff date: "2019-12-27T00:00:00.000Z" total interest: 5989
monthly payment: 722 payoff date: "2019-12-20T00:00:00.000Z" total interest: 5937
monthly payment: 727 payoff date: "2019-12-13T00:00:00.000Z" total interest: 5885
monthly payment: 731 payoff date: "2019-11-29T00:00:00.000Z" total interest: 5835
monthly payment: 735 payoff date: "2019-11-22T00:00:00.000Z" total interest: 5785
monthly payment: 740 payoff date: "2019-11-15T00:00:00.000Z" total interest: 5736
monthly payment: 744 payoff date: "2019-11-08T00:00:00.000Z" total interest: 5688
monthly payment: 748 payoff date: "2019-11-01T00:00:00.000Z" total interest: 5641
monthly payment: 753 payoff date: "2019-10-25T00:00:00.000Z" total interest: 5595
monthly payment: 757 payoff date: "2019-10-18T00:00:00.000Z" total interest: 5549
monthly payment: 761 payoff date: "2019-10-11T00:00:00.000Z" total interest: 5504
monthly payment: 766 payoff date: "2019-09-27T00:00:00.000Z" total interest: 5460
monthly payment: 770 payoff date: "2019-09-20T00:00:00.000Z" total interest: 5417
monthly payment: 774 payoff date: "2019-09-13T00:00:00.000Z" total interest: 5374
monthly payment: 779 payoff date: "2019-09-06T00:00:00.000Z" total interest: 5332
monthly payment: 783 payoff date: "2019-08-30T00:00:00.000Z" total interest: 5291
monthly payment: 788 payoff date: "2019-08-23T00:00:00.000Z" total interest: 5250
monthly payment: 792 payoff date: "2019-08-23T00:00:00.000Z" total interest: 5210
monthly payment: 796 payoff date: "2019-08-16T00:00:00.000Z" total interest: 5171
monthly payment: 801 payoff date: "2019-08-09T00:00:00.000Z" total interest: 5132
monthly payment: 805 payoff date: "2019-08-02T00:00:00.000Z" total interest: 5094
monthly payment: 809 payoff date: "2019-07-26T00:00:00.000Z" total interest: 5056
monthly payment: 814 payoff date: "2019-07-19T00:00:00.000Z" total interest: 5019
monthly payment: 818 payoff date: "2019-07-12T00:00:00.000Z" total interest: 4982
monthly payment: 822 payoff date: "2019-07-05T00:00:00.000Z" total interest: 4946
monthly payment: 827 payoff date: "2019-06-28T00:00:00.000Z" total interest: 4911
monthly payment: 831 payoff date: "2019-06-28T00:00:00.000Z" total interest: 4876
monthly payment: 835 payoff date: "2019-06-21T00:00:00.000Z" total interest: 4842
monthly payment: 840 payoff date: "2019-06-14T00:00:00.000Z" total interest: 4808
monthly payment: 844 payoff date: "2019-06-07T00:00:00.000Z" total interest: 4774
monthly payment: 848 payoff date: "2019-05-31T00:00:00.000Z" total interest: 4741
monthly payment: 853 payoff date: "2019-05-24T00:00:00.000Z" total interest: 4708
monthly payment: 857 payoff date: "2019-05-24T00:00:00.000Z" total interest: 4676
monthly payment: 861 payoff date: "2019-05-17T00:00:00.000Z" total interest: 4645
monthly payment: 866 payoff date: "2019-05-10T00:00:00.000Z" total interest: 4614
monthly payment: 870 payoff date: "2019-05-03T00:00:00.000Z" total interest: 4583
monthly payment: 874 payoff date: "2019-05-03T00:00:00.000Z" total interest: 4552
monthly payment: 879 payoff date: "2019-04-26T00:00:00.000Z" total interest: 4522
monthly payment: 883 payoff date: "2019-04-19T00:00:00.000Z" total interest: 4493
monthly payment: 888 payoff date: "2019-04-19T00:00:00.000Z" total interest: 4464
monthly payment: 892 payoff date: "2019-04-12T00:00:00.000Z" total interest: 4435
monthly payment: 896 payoff date: "2019-04-05T00:00:00.000Z" total interest: 4406
monthly payment: 901 payoff date: "2019-03-29T00:00:00.000Z" total interest: 4378
monthly payment: 905 payoff date: "2019-03-29T00:00:00.000Z" total interest: 4351
monthly payment: 909 payoff date: "2019-03-22T00:00:00.000Z" total interest: 4323
monthly payment: 914 payoff date: "2019-03-15T00:00:00.000Z" total interest: 4296
monthly payment: 918 payoff date: "2019-03-15T00:00:00.000Z" total interest: 4270
monthly payment: 922 payoff date: "2019-03-08T00:00:00.000Z" total interest: 4243
monthly payment: 927 payoff date: "2019-03-01T00:00:00.000Z" total interest: 4217
monthly payment: 931 payoff date: "2019-03-01T00:00:00.000Z" total interest: 4192
monthly payment: 935 payoff date: "2019-02-22T00:00:00.000Z" total interest: 4166
monthly payment: 940 payoff date: "2019-02-22T00:00:00.000Z" total interest: 4141
monthly payment: 944 payoff date: "2019-02-15T00:00:00.000Z" total interest: 4117
monthly payment: 948 payoff date: "2019-02-08T00:00:00.000Z" total interest: 4092
monthly payment: 953 payoff date: "2019-02-08T00:00:00.000Z" total interest: 4068
monthly payment: 957 payoff date: "2019-02-01T00:00:00.000Z" total interest: 4044
monthly payment: 961 payoff date: "2019-02-01T00:00:00.000Z" total interest: 4021
monthly payment: 966 payoff date: "2019-01-25T00:00:00.000Z" total interest: 3997
monthly payment: 970 payoff date: "2019-01-25T00:00:00.000Z" total interest: 3974
monthly payment: 974 payoff date: "2019-01-18T00:00:00.000Z" total interest: 3952
monthly payment: 979 payoff date: "2019-01-11T00:00:00.000Z" total interest: 3929
monthly payment: 983 payoff date: "2019-01-11T00:00:00.000Z" total interest: 3907
monthly payment: 988 payoff date: "2019-01-04T00:00:00.000Z" total interest: 3885
monthly payment: 992 payoff date: "2019-01-04T00:00:00.000Z" total interest: 3863
monthly payment: 996 payoff date: "2018-12-28T00:00:00.000Z" total interest: 3842
monthly payment: 1001 payoff date: "2018-12-28T00:00:00.000Z" total interest: 3820
monthly payment: 1005 payoff date: "2018-12-21T00:00:00.000Z" total interest: 3799
monthly payment: 1009 payoff date: "2018-12-21T00:00:00.000Z" total interest: 3779
monthly payment: 1014 payoff date: "2018-12-14T00:00:00.000Z" total interest: 3758
monthly payment: 1018 payoff date: "2018-12-14T00:00:00.000Z" total interest: 3738
monthly payment: 1022 payoff date: "2018-12-07T00:00:00.000Z" total interest: 3718
monthly payment: 1027 payoff date: "2018-12-07T00:00:00.000Z" total interest: 3698
monthly payment: 1031 payoff date: "2018-11-30T00:00:00.000Z" total interest: 3678
monthly payment: 1035 payoff date: "2018-11-30T00:00:00.000Z" total interest: 3659
monthly payment: 1040 payoff date: "2018-11-23T00:00:00.000Z" total interest: 3640
monthly payment: 1044 payoff date: "2018-11-23T00:00:00.000Z" total interest: 3621
monthly payment: 1048 payoff date: "2018-11-16T00:00:00.000Z" total interest: 3602
monthly payment: 1053 payoff date: "2018-11-16T00:00:00.000Z" total interest: 3583
monthly payment: 1057 payoff date: "2018-11-09T00:00:00.000Z" total interest: 3565
monthly payment: 1061 payoff date: "2018-11-09T00:00:00.000Z" total interest: 3546
monthly payment: 1066 payoff date: "2018-11-02T00:00:00.000Z" total interest: 3528
monthly payment: 1070 payoff date: "2018-11-02T00:00:00.000Z" total interest: 3511
monthly payment: 1074 payoff date: "2018-11-02T00:00:00.000Z" total interest: 3493
monthly payment: 1079 payoff date: "2018-10-26T00:00:00.000Z" total interest: 3475
monthly payment: 1083 payoff date: "2018-10-26T00:00:00.000Z" total interest: 3458




