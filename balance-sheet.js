this.sum = function getSum(expenses) {
    console.log('in');
    console.log(expenses.length);
    var sum = 0;

    for(var i = 0; i < expenses.length; i++) {
        sum += expenses[i];
    }

    return sum;
}