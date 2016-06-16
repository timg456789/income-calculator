# income-calculator
This is where I sharpen my raw coding skills and stay technically sharp.

In this project I will strive for perfect 100 line classes.
A test for each production class.
Adhering to the three rules of TDD.

Right now I'm starting with dates.
I have a basic function and I'm going to see how far I can take it over the next few days.
I'm eventually going to try and break it as well pushing it beyond its limit.

For now though, I want to find some interesting things in the calendar.
The calendar is beginning to fascinate me with its complexity.

######2016-15-06
Dates went pretty well. They work as I need coming back without remembering how they worked or even what I was trying to do.

So right now, there could be an issue calculating weekly expenses. Weeks in a month fluctuate.
The code looked weird and I'm not sure if I have a specific test for that, so it's probably not working.
Either way it's acceptable. I want to tighten the interface and get a UI going.

I think I can get a quick app going with S3, then I can change out the back-end to Dynamo db in another project.
**It has ssl, a form, and it's using infrastructure as code (with tests of course - perfect documentation) with dynamodb**.
When I put it there, then I will worry about perfecting the calculations and as well as the input data.
The form will allow me to aggregate my expenses as I plug them in.

Eventually I will have not only a running balance, but be able to project scenarios(purchases) on the fly.