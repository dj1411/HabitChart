/*******************************************************************************
 * MIT License
 * 
 * Copyright (c) 2018 Jayanta Debnath
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *******************************************************************************/

function main()
{
//    DataReset(1, 1, 1); return; /* 0=NA, 1=reset; ramData, localData, cloudData */
//    testcode();

    DataLoad();     /* data should be loaded from localstorage everytime a page is loaded. this ensures to refresh data if updated from another page */

    DataRefresh(0);
    setInterval(function () { DataRefresh(0); }, SYNC_INTERVAL_S * 1000);
    
    setStyleIndex();

    /* handle the back button */
    document.addEventListener("backbutton", onback, false);
}

function testcode() {
    data = JSON.parse(localStorage.getItem("data"));
    if (data == null) data = dataInit;

    data.Timestamp = "";

    DataSave(0);
}

function refreshTable()
{
	/* check if screen is too small */
	if( window.innerWidth < (WIDTH_HABIT_COL + WIDTH_DATA_COL) )
	{
		alert( "Your screen is too small for the app to run properly" );
		return;
	}

    /* get the table and clear all contents */
    var table = document.getElementById("tableMain");
    table.innerHTML = "";

    
    /* date row */
    var row = document.createElement("div");
    table.appendChild(row);
    row.classList.add("w3-cell-row");
    row.classList.add("w3-border-bottom");
    
    /* blank cell - sign */
    var cell = document.createElement("div");
    row.appendChild(cell);
    cell.classList.add("w3-cell");
    cell.style.width = WIDTH_SIGN + "px";

    /* blank cell - habit */
    var cell = document.createElement("div");
    row.appendChild(cell);
    cell.classList.add("w3-cell");
    cell.style.width = WIDTH_HABIT_COL + "px";

    /* calculate number of columns to display */
    var numDataCol = Math.floor((row.clientWidth - WIDTH_HABIT_COL - WIDTH_SIGN) / WIDTH_DATA_COL);
    numDataCol = Math.min(numDataCol, DataListSize(), MAX_HISTORY_DATA);

    /* fill the dates */
    for (var c = 0; c < numDataCol; c++)
    {
        var cell = document.createElement("div");
        row.appendChild(cell);
        cell.classList.add("w3-cell");
        cell.classList.add("w3-small");
        cell.classList.add("w3-center");
        cell.style.width = WIDTH_DATA_COL + "px";
        
        var date = moment();
        date = date.subtract(c, "days");
        var text = document.createElement("span");
        text.innerHTML = date.format("ddd<br>D/M");
        cell.appendChild(text);
    }

    /* Fill the table */
    for (var r = 0; r < data.HabitList.length; r++) {
        var row = document.createElement("div");
        table.appendChild(row);
        row.setAttribute("id", "row_" + r);
        row.classList.add("w3-cell-row");
        row.classList.add("w3-border-bottom");
        row.style.height = HEIGHT_ROW + "px";
        row.style.lineHeight = HEIGHT_ROW + "px";

        /* Target achievement signs */
        var cell = document.createElement("div");
        row.appendChild(cell);
        cell.classList.add("w3-cell");
        cell.style.width = WIDTH_SIGN + "px";
        var sign = document.createElement("i");
        cell.appendChild(sign);
        sign.classList.add("fa");
        sign.classList.add("fa-circle");
        sign.setAttribute("id", "sign_" + r);
        sign.setAttribute("name", "sign_" + r);
        sign.style.color = "transparent";
        setColorSign(r);
        
        /* Habits */
        var cell = document.createElement("div");
        row.appendChild(cell);
        cell.classList.add("w3-cell");
        cell.classList.add("habitColumn");
        cell.setAttribute("id", "HabitList_" + r);
        cell.setAttribute("onclick", "selectHabit('HabitList_" + r + "')");
        cell.textContent = data.HabitList[r].Name;
        cell.style.width = WIDTH_HABIT_COL + "px";

        /* Display Data bars */
        for (var c = 0; c < numDataCol; c++) {
            var cell = document.createElement("div");
            row.appendChild(cell);
            cell.classList.add("w3-cell");
            cell.setAttribute("onclick", "onclickDataCell(" + r + "," + c + ")");
            cell.style.width = WIDTH_DATA_COL + "px";

            /* creating the bar chart */
            var curData = DataGetByRC(r, c);
            var arrData = DataGetByRow(r).slice(0,MAX_HISTORY_DATA);
            var max = Math.max(...arrData);
            var height = 0;
            if(curData == 0) {
                height = 0;
            }
            else if(arrData.length == 1) {
                height = HEIGHT_ROW;
            }
            else {
                var step = HEIGHT_ROW / max;
                height = curData*step;
            }
            cell.style.borderBottom = height + "px solid";
            cell.style.borderBottomColor = COLOR_TARGET_GREEN;
        }
    }
}

function populateDataVal(r, c)
{
    var arrData = DataGetByRow(r).slice(0,MAX_HISTORY_DATA);
    var arrButton = new Array();
    
    arrButton.push(0);
    arrButton.push(arrData[0]);
    var max = Math.max(...arrData);
    var min = Math.min(...arrData);
    if(max == 0) arrButton.push(1);
    arrButton.push(max);
    arrButton.push(min);
    arrButton.push(Math.ceil(max + max*0.1));
    arrButton.push(Math.floor(min - min*0.1));
    arrButton.push(min + Math.round((max-min)/3));
    arrButton.push(max - Math.round((max-min)/3));
    
    /* removing duplicates */
    arrButton = ( arrButton.sort(function(a, b){return a-b}).filter( function(currentValue, index, arr) {
        return ( index == arr.lastIndexOf(currentValue) );
    }));
    
    return arrButton;
}

/* e.g. HabitId = HabitList_<row> */
function selectHabit(habitId)
{
    var selectedHabitId = DataSelectedHabitGetId();  
    var rowIdNew = "row_" + habitId.split("_")[1];

    /* clear the old selection */
    if (selectedHabitId != null)
    {
        var rowIdOld = "row_" + selectedHabitId.split("_")[1];
        document.getElementById(rowIdOld).classList.add("w3-text-theme");        
        document.getElementById(rowIdOld).classList.remove("w3-theme-l4");
    }
    

    /* selected habit is clicked again - de-selection */
    if (habitId == selectedHabitId)
    {
        /* reset selection */
        DataSelectedHabitReset();

        /* change toolbar icons */
        toggleToolbar();
    }
    else  /* A different habit is selected */
    {
        /* set selection */
        document.getElementById(rowIdNew).classList.add("w3-theme-l4"); 
        document.getElementById(rowIdNew).classList.remove("w3-text-theme"); 
        DataSelectedHabitUpdate(habitId);

        /* change toolbar icons */
        toggleToolbar();
    }
}

function removeHabit()
{
    if (DataSelectedHabitGetId() == null)
        return;

    if (window.confirm( "Are you sure to delete " + DataSelectedHabitGetStr() + "?" ))
        DataHabitRemove(DataSelectedHabitGetStr());

    DataRefresh(0);
    DataSelectedHabitReset();
    toggleToolbar();
}

function toggleToolbar()
{
    if (selectedHabit == "") /* habit not selected */
    {
        $(".divToolbarSelection").css("display", "none");
        $(".divToolbarNormal").css("display", "block");
        document.getElementById("title").classList.remove("w3-hide-small");
    }
    else /* habit selected */
    {
        $(".divToolbarSelection").css("display", "block");
        $(".divToolbarNormal").css("display", "none");
        document.getElementById("title").classList.add("w3-hide-small");
        
        /* disable move up/down on first/last habit */
        var rowCur = DataSelectedHabitGetId().split("_")[1];
        var rowLast = data.HabitList.length - 1;
        if(document.getElementById("buttonUp").classList.contains("w3-hide"))
            document.getElementById("buttonUp").classList.remove("w3-hide");
        if(document.getElementById("buttonDown").classList.contains("w3-hide"))
            document.getElementById("buttonDown").classList.remove("w3-hide");
        if(rowCur == 0) 
            document.getElementById("buttonUp").classList.add("w3-hide");
        if(rowCur == rowLast)
            document.getElementById("buttonDown").classList.add("w3-hide");
    }
}

function onclickAddHabitButton()
{
    DataSelectedHabitReset(); 
    document.getElementById("titleModalHabit").innerText = "Add habit";
    document.getElementById("modalAddHabit").style.display = "block";
    document.getElementById("textHabit").focus();
}

function onclickEditHabitButton()
{
    document.getElementById("titleModalHabit").innerText = "Update habit";
    document.getElementById("textHabit").value = DataSelectedHabitGetStr();
    document.getElementById("modalAddHabit").style.display = "block";
    
    /* determine seleted row */
    var r = parseInt(DataSelectedHabitGetId().slice(DataSelectedHabitGetId().lastIndexOf("_") + 1));
    
    /* display the Target as per data */
    if(data.HabitList[r].Target.slice(0,5) == "Reach") {
        document.getElementById("optionTarget").value = data.HabitList[r].Target.slice(0,5);
        document.getElementById("textTimes").value = data.HabitList[r].Target.split("_")[1];
        document.getElementById("textDays").value = data.HabitList[r].Target.split("_")[2];
    }
    else {
        document.getElementById("optionTarget").value = data.HabitList[r].Target;
    }
    
    /* display more fields for Reach */
    if( data.HabitList[r].Target.slice(0,5) == "Reach" ) {
        document.getElementById("divReach").style.display = "block";
        document.getElementById("textTimes").required = true;
        document.getElementById("textDays").required = true;
    }
    else {
        document.getElementById("divReach").style.display = "none";
        document.getElementById("textTimes").required = false;
        document.getElementById("textDays").required = false;
    }
}

function onclickStatButton() {
    document.getElementById("modalStat").style.display = "block";

    /* patch: fix border going out of modal for secStatChart */
    divwidth = document.getElementById("modalcontentStat").clientWidth;
    document.getElementById("secStatChart").style.width = (divwidth - 32) + "px"; /* 32 = margin width left and right added */

    createStatChart(document.getElementById("optionStat").value);
}

function onclickMoveHabitButton(dir) {
    var oldindex = data.HabitList.findIndex( function(obj) {
        return (obj.Name == selectedHabit);
    });    
    
    var newindex;
    if(dir == "up")
        newindex = oldindex - 1;
    else if(dir == "down")
        newindex = oldindex + 1;
    
    DataHabitMove(oldindex, newindex);
    DataMove(oldindex, newindex);
    
    refreshTable();
    
    /* todo patches to avoid selection restore */
    DataSelectedHabitReset();
    toggleToolbar();
}

function onclickDataCell(r, c)
{
    /* display the modal */
    document.getElementById("modalEditData").style.display = "block";
    document.getElementById("textData").value = DataGetByRC(r,c );
    document.getElementById("textData").select();
    
    /* generate the value buttons */
    var div = document.getElementById("divEditDataVal");
    div.innerHTML = "";
    var arr = populateDataVal(r,c);
    for( var i=0; i<arr.length; i++) {
        var button = document.createElement("span");
        div.appendChild(button);
        button.classList.add("w3-button");
        button.classList.add("w3-border");
        button.classList.add("w3-tiny");
        button.style.margin = "5px";
        button.innerText = arr[i];
        button.setAttribute("onclick", "onclickEditDataVal(" + r + "," + c + "," + arr[i] + ")");
    }
    
    /* fill the labels */
    var date = moment();
    date = date.subtract(c, "days");
    document.getElementById("labelDate").innerText = date.format("dddd, Do MMMM YYYY");
    document.getElementById("labelHabit").innerText = data.HabitList[r].Name;
    
    /* fill onsubmit */
    document.getElementById("formEditData").setAttribute("onsubmit", "onsubmitEditData(" + r + "," + c + ")");
}

function onclickEditDataVal(r, c, val) {
    document.getElementById("textData").value = val;
    $("#formEditData").submit(); // for strange reasons, without jquery onsubmitEditData() is not getting called!
}

function onclickFeedback() {
    if(config.email == "jayanta.dn@gmail.com")
        location.assign("feedbackreader.html");
    else
        location.assign("feedback.html");
}

function onclickAbout() {
    sidebarHide();
    document.getElementById("modalAbout").style.display = "block";
}

function onclickHelp() {
    sidebarHide();
    document.getElementById("modalHelp").style.display = "block";
    slideshowHelp(0);
}

function onclickLicense() {
    var secLicense = document.getElementById("secLicense");
    if(secLicense.classList.contains("w3-show"))
        secLicense.classList.remove("w3-show");
    else
        secLicense.classList.add("w3-show");
}

function onsubmitEditData(r, c) {
    /* update the data */
    var mom = moment();
    var d = mom.subtract(c, "day");
    var arr = DataGetByDate(d.toDate());
    arr[r] = parseInt(document.getElementById("textData").value);
    DataSetByDate(d.toDate(), arr);
    
    /* update the `entry` field of habit if necessary */
    var habit = data.HabitList[r];
    var curentry = moment( habit.Entry.split("_")[1] + "-" + habit.Entry.split("_")[2] + "-2018", "D-M-YYYY" );
    if(curentry.isAfter(d)) { /* editing data before the `entry` date of habit */
        habit.Entry = "Date_" + d.format("D_M");
        DataHabitUpdate(habit.Name, habit);
    }
}

function onchangeTarget() {
    if(document.getElementById("optionTarget").value == "Reach") {
        document.getElementById("divReach").style.display = "block";
        document.getElementById("textTimes").required = true;
        document.getElementById("textDays").required = true;        
    }
    else {
        document.getElementById("divReach").style.display = "none";
        document.getElementById("textTimes").required = false;
        document.getElementById("textDays").required = false;
    }
}

function onchangeStat() {
    createStatChart(document.getElementById("optionStat").value);
}

function addupdateHabit()
{
    var habit = new Object();
    habit.Name = document.getElementById("textHabit").value.trim();
    habit.Target = document.getElementById("optionTarget").value;
    
    if(habit.Target.slice(0,5) == "Reach") {
        habit.Target = habit.Target + "_" + document.getElementById("textTimes").value + "_" + document.getElementById("textDays").value;
    }
    
    if( DataSelectedHabitGetStr() == "" )
    {
        /* add */
        habit.Entry = "Date_" + moment().format("D_M");
        DataHabitAdd(habit);
    }
    else
    {
        /* update */
        habit.Entry = data.HabitList[DataSelectedHabitGetId().split("_")[1]].Entry; /* retain the old habit entry */
        DataHabitUpdate(DataSelectedHabitGetStr(), habit);
        DataSelectedHabitReset();
    }
}

/* compute the color of traffic light.
 * return expected and actual average.
 */
function setColorSign(r) {
    /* prepare the return value */
    var ret = new Object();
    
    /* crop the data array */
    var arr = DataGetByRow(r).slice(0,MAX_HISTORY_DATA);
    
    /* average of the complete array */
    var sum = 0;
    var i=0;
    for(; i<arr.length; i++) sum += arr[i];
    var oldavg = sum / i;
    
    /* average of the last 7 days */
    var curavg = 0;
    if(arr.length <= 7) {
        curavg = arr[0];
    }
    else {
        var sum = 0;
        for(var i=0; i<7; i++) sum += arr[i];
        curavg = sum / 7;
    }
    ret.avgact = curavg;    /* for improve and reduce */
    
    var color = "transparent";
    var hi = oldavg + 0.1*oldavg;
    var lo = oldavg - 0.1*oldavg;
    switch(data.HabitList[r].Target) {
        case "Improve":
            ret.avgexp = hi;
            if(curavg >= hi) color = COLOR_TARGET_GREEN;
            else if(curavg < lo) color = COLOR_TARGET_RED;
            else color = COLOR_TARGET_YELLOW;
            break;
            
        case "Reduce":
            ret.avgexp = lo;
            if(curavg > hi) color = COLOR_TARGET_RED;
            else if(curavg <= lo) color = COLOR_TARGET_GREEN;
            else color = COLOR_TARGET_YELLOW;
            break;
            
        default:
            /* case Reach */
            if( data.HabitList[r].Target.slice(0,5) == "Reach" ) {
                var target = data.HabitList[r].Target.split("_")[1] / data.HabitList[r].Target.split("_")[2];
                var higreen = target + 0.1*target;
                var logreen = target - 0.1*target;
                var hiyellow = target + 0.25*target;
                var loyellow = target - 0.25*target;
                
                ret.avgexp = target;
                ret.avgact = oldavg;    /* for reach */
                if(oldavg >= logreen && oldavg <= higreen)
                    color = COLOR_TARGET_GREEN;
                else if(oldavg > loyellow && oldavg < hiyellow) color = COLOR_TARGET_YELLOW
                else color = COLOR_TARGET_RED;
                
                break;
            }
            else { /* default */
                alert("Invalid Target data encountered");                
            }
    }
    
    document.getElementById("sign_" + r).style.color = color;
    return ret;
}

function sidebarShow() {
	document.getElementById("divSidebar").style.display = "block";
	document.getElementById("overlaySidebar").style.display = "block";
}

function sidebarHide() {
	document.getElementById("divSidebar").style.display = "none";
	document.getElementById("overlaySidebar").style.display = "none";
}

function exitApp() {
    /* Check for Android */
    if(navigator.userAgent.indexOf("Android") >= 0) {         
        navigator.app.exitApp()
    }
    else {
        window.close();
    }
}

function onback(e) {
    e.preventDefault();
    exitApp();
}

function createStatChart(numDays) {
    /* clear existing chart */
    var secStatChart = document.getElementById("secStatChart"); 
    secStatChart.innerHTML = "";
    
    /* set height of chart */
    document.getElementById("secStatChart").style.height = HEIGHT_STAT_CHART;
    
    /* get the row of selected habit */
    var row=0
    for(; row < data.HabitList.length; row++) {
        if(data.HabitList[row].Name == selectedHabit)
            break;
    }
    
    /* create the chart */
    var arrData = DataGetByRow(row);
    if(numDays > 0) arrData = arrData.slice(0,numDays);
    var max = Math.max(...arrData);
    for (var i = 0; i < arrData.length; i++) {
        var cell = document.createElement("div");
        secStatChart.appendChild(cell);
        cell.classList.add("w3-cell");

        /* creating the bar chart */
        /* Here the height calculation is done considering min as 0 */
        var step = HEIGHT_STAT_CHART / max;
        cell.style.borderBottom = (arrData[i] * step) + "px solid";
    }    
    
    /* retrieve the actual and expected average */
    var avg = setColorSign(row);
    var avgexp, avgact;
    if(avg.avgexp.toString().indexOf(".") == -1)
        avgexp = avg.avgexp;
    else
        avgexp = avg.avgexp.toString().split(".")[0] + "." + (avg.avgexp.toString().split(".")[1]).charAt(0) + (avg.avgexp.toString().split(".")[1]).charAt(1);
    if(avg.avgact.toString().indexOf(".") == -1)
        avgact = avg.avgact;
    else
        avgact = avg.avgact.toString().split(".")[0] + "." + (avg.avgact.toString().split(".")[1]).charAt(0) + (avg.avgact.toString().split(".")[1]).charAt(1);
    
    /* Filling the figures */
    document.getElementById("figMin").innerText = "Min: " + Math.min(...arrData);
    document.getElementById("figMax").innerText = "Max: " + max;
    document.getElementById("figAct").innerText = "Avg: " + avgact;
    document.getElementById("figExp").innerText = "Exp: " + avgexp;
}

function slideshowHelp(dir) {
    var x = document.getElementsByClassName("slideHelp");
    var curIdx = 0;
    
    for (i = 0; i < x.length; i++) {
        if(x[i].style.display == "block")
            curIdx = i;
        x[i].style.display = "none";
    }

    console.log(curIdx);
    switch(dir) {
        case 0:     /* show the first image */
            x[0].style.display = "block";
            break;
            
        case 1:     /* show the next image */
            if(curIdx == (x.length-1)) curIdx--;
            x[curIdx+1].style.display = "block";
            break;

        case -1:     /* show the prev image */
            if(curIdx == 0) curIdx++;
            x[curIdx-1].style.display = "block";
            break;
    }
}