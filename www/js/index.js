function main()
{
   // DataReset(1, 1, 0); return; /* 0=NA, 1=reset; ramData, localData, cloudData */
//    testcode();

    DataLoad();     /* data should be loaded from localstorage everytime a page is loaded. this ensures to refresh data if updated from another page */
    DataRefresh(0); /* see description about the function definition */
    setStyleIndex();

    setInterval(function () { DataRefresh(0); }, SYNC_INTERVAL_S * 1000);
}

function testcode() {
    data = JSON.parse(localStorage.getItem("data"));
    if (data == null) data = dataInit;

    data.Timestamp = "";

    DataSave(0);
}

function refreshTable()
{
	/* check if mobile screen is too small */
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
        
        var text, day;
        var date = new Date();
        date.setDate(date.getDate() - c);
        switch(date.getDay()) {
            case 0: day = "Sun"; break;
            case 1: day = "Mon"; break;
            case 2: day = "Tue"; break;
            case 3: day = "Wed"; break;
            case 4: day = "Thu"; break;
            case 5: day = "Fri"; break;
            case 6: day = "Sat"; break;
        }
        if(c==0) day = "Today";
        text = document.createElement("span");
        text.innerHTML = day + "<br>" + date.getDay() + "/" + (date.getMonth()+1);
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
            var min = Math.min(...arrData);
            var height = 0;
            if(curData == 0) {
                height = 0;
            }
            else if(arrData.length == 1) {
                height = HEIGHT_ROW;
            }
            else if(curData <= min) {
                height = 1;
            }
            else if(curData >= max) {
                height = HEIGHT_ROW;
            }
            else {
                var step = HEIGHT_ROW / (max - min);
                height = min + curData*step;
            }
            cell.style.borderBottom = height + "px solid";
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

    refreshTable();
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

function onsubmitEditData(r, c) {
    var mom = moment();
    var date = mom.subtract(c, "day").toDate();
    
    var arr = DataGetByDate(date);
    arr[r] = parseInt(document.getElementById("textData").value);
    DataSetByDate(date, arr);
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

function addupdateHabit()
{
    var habit = new Object();
    habit.Name = document.getElementById("textHabit").value;
    habit.Target = document.getElementById("optionTarget").value;
    
    if(habit.Target.slice(0,5) == "Reach") {
        habit.Target = habit.Target + "_" + document.getElementById("textTimes").value + "_" + document.getElementById("textDays").value;
    }
    
    if( DataSelectedHabitGetStr() == "" )
    {
        DataHabitAdd(habit);
    }
    else
    {
        DataHabitUpdate(DataSelectedHabitGetStr(), habit);
        DataSelectedHabitReset();
    }
}

function setColorSign(r) {
    var arr = DataGetByRow(r).slice(0,MAX_HISTORY_DATA);
    
    var sum = 0;
    var i=0;
    for(; i<arr.length; i++) sum += arr[i];
    var oldavg = sum / i;
    
    var curavg = 0;
    if(arr.length <= 7) {
        curavg = arr[0];
    }
    else {
        var sum = 0;
        for(var i=0; i<7; i++) sum += arr[i];
        curavg = sum / 7;
    }
    
    var color = "transparent";
    var hi = oldavg + 0.1*oldavg;
    var lo = oldavg - 0.1*oldavg;
    switch(data.HabitList[r].Target) {
        case "Improve":
            if(curavg > hi) color = COLOR_TARGET_GREEN;
            else if(curavg < lo) color = COLOR_TARGET_RED;
            else color = COLOR_TARGET_YELLOW;
            break;
            
        case "Reduce":
            if(curavg > hi) color = COLOR_TARGET_RED;
            else if(curavg < lo) color = COLOR_TARGET_GREEN;
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
                
                if(oldavg > logreen && oldavg <higreen) color = COLOR_TARGET_GREEN;
                else if(oldavg > loyellow && oldavg <hiyellow) color = COLOR_TARGET_YELLOW
                else color = COLOR_TARGET_RED;
                
                break;
            }
            else { /* default */
                alert("Invalid Target data encountered");                
            }
    }
    
    document.getElementById("sign_" + r).style.color = color;
}

function sidebarShow() {
	document.getElementById("divSidebar").style.display = "block";
	document.getElementById("overlaySidebar").style.display = "block";
}

function sidebarHide() {
	document.getElementById("divSidebar").style.display = "none";
	document.getElementById("overlaySidebar").style.display = "none";
}



