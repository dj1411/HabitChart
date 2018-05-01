function MyDate(d, m, y)
{
    this.day = d;
    this.mon = m;
    this.yr = y;
    
    this.addDay = function(d) {
        var newday = this.day+d;
        var retd = new MyDate(newday, this.mon, this.yr);
        return retd;
    }
}

function MyDateToday()
{
    var date = new Date();
    var retd = new MyDate(date.getDate(), date.getMonth()+1, date.getFullYear());
    return retd;
}