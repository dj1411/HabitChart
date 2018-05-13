function main()
{
//                DataReset(1, 1, 1); return; /* 0=NA, 1=reset; ramData, localData, cloudData */
    //testcode();

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
	if( window.innerWidth < (HABIT_COL_WIDTH + DATA_COL_WIDTH) )
	{
		alert( "Your screen is too small for the app to run properly" );
		return;
	}

    /* get the table and clear all contents */
    var table = document.getElementById("tableMain");
    table.innerHTML = "";

    /* calculate number of columns to display */
    var numDataCol = (window.innerWidth - HABIT_COL_WIDTH) / DATA_COL_WIDTH;
    
    /** date row **/

    /* row */
    var row = document.createElement("div");
    table.appendChild(row);
    row.classList.add("w3-cell-row");
    row.classList.add("w3-border-bottom");
    
    /* blank cell - sign */
    var cell = document.createElement("div");
    row.appendChild(cell);
    cell.classList.add("w3-cell");
    cell.style.width = SIGN_WIDTH + "px";
    var sign = document.createElement("i");
    cell.appendChild(sign);
    sign.classList.add("fa");
    sign.classList.add("fa-circle");
    sign.style.color = "transparent";

    /* blank cell - habit */
    var cell = document.createElement("div");
    row.appendChild(cell);
    cell.classList.add("w3-cell");
    cell.textContent = "HabitList";
    cell.style.width = HABIT_COL_WIDTH + "px";
    cell.style.color = "transparent";

    /* fill the dates */
    for (var c = 0; (c < DataListSize()) && (c < numDataCol); c++)
    {
        var cell = document.createElement("div");
        row.appendChild(cell);
        cell.classList.add("w3-cell");
        cell.classList.add("w3-small");
        cell.classList.add("w3-center");
        cell.style.width = DATA_COL_WIDTH + "px";
        
        var text;
        if(c==0) {
            text = document.createTextNode("Today");
        }
        else {
            var date = new Date();
            date.setDate(date.getDate() - c);
            if (date.toLocaleDateString().split("/")[0] == date.getDate())  /* check locale setting */
                text = document.createTextNode( date.getDate() + "/" + (date.getMonth()+1) );
            else
                text = document.createTextNode( (date.getMonth()+1) + "/" + date.getDate() );
        }
        cell.appendChild(text);
    }

    /* Fill the table */
    for (var r = 0; r < data.HabitList.length; r++) {
        var row = document.createElement("div");
        table.appendChild(row);
        row.classList.add("w3-cell-row");
        row.classList.add("w3-border-bottom");
        row.style.height = ROW_HEIGHT + "px";
        row.style.lineHeight = ROW_HEIGHT + "px";

        /* Target achievement signs */
        var cell = document.createElement("div");
        row.appendChild(cell);
        cell.classList.add("w3-cell");
        cell.style.width = SIGN_WIDTH + "px";
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
        cell.setAttribute("name", "HabitList_" + r);
        cell.setAttribute("onclick", "selectHabit('HabitList_" + r + "')");
        cell.textContent = data.HabitList[r].Name;
        cell.style.width = HABIT_COL_WIDTH + "px";

        /* Display Data */
        for (var c = 0; (c < DataListSize()) && (c < numDataCol); c++) {
            var cell = document.createElement("div");
            row.appendChild(cell);
            cell.classList.add("w3-cell");
            cell.setAttribute("onclick", "onclickDataCell(" + r + "," + c + ")");
            cell.style.width = DATA_COL_WIDTH + "px";

            /* creating the bar chart */
            var curData = DataGetByRC(r, c);
            var arrData = DataGetByRow(r);
            var max = Math.max(...arrData);
            var min = Math.min(...arrData);
            var height = 0;
            if(curData == 0) {
                height = 0;
            }
            else if(arrData.length == 1) {
                height = ROW_HEIGHT;
            }
            else if(curData <= min) {
                height = 1;
            }
            else if(curData >= max) {
                height = ROW_HEIGHT;
            }
            else {
                var step = ROW_HEIGHT / (max - min);
                height = min + curData*step;
            }
            cell.style.borderBottom = height + "px solid";
        }
    }
}

function populateDataVal(r, c)
{
    var arrData = DataGetByRow(r);
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

    if (selectedHabitId != null)
    {
        document.getElementById(selectedHabitId).classList.add("w3-text-theme");        
        document.getElementById(selectedHabitId).classList.remove("w3-theme-l4");
    }
    

    if (habitId == selectedHabitId) /* de-selection */
    {
        /* reset selection */
        DataSelectedHabitReset();

        /* change toolbar icons */
        toggleToolbar();
    }
    else  /* selection */
    {
        /* set selection */
        document.getElementById(habitId).classList.add("w3-theme-l4"); 
        document.getElementById(habitId).classList.remove("w3-text-theme"); 
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
    if (selectedHabit == "")
    {
        $(".divToolbarSelection").css("display", "none");
        $(".divToolbarNormal").css("display", "block");
    }
    else
    {
        $(".divToolbarSelection").css("display", "block");
        $(".divToolbarNormal").css("display", "none");
    }
}

function onclickAddButton()
{
    DataSelectedHabitReset(); 
    document.getElementById("titleModalHabit").innerText = "Add habit";
    document.getElementById("modalAddHabit").style.display = "block";
    document.getElementById("textHabit").focus();
}

function onclickEditButton()
{
    document.getElementById("titleModalHabit").innerText = "Update habit";
    document.getElementById("textHabit").value = DataSelectedHabitGetStr();
    document.getElementById("modalAddHabit").style.display = "block";
    document.getElementById("textHabit").focus();
    
    /* determine seleted row */
    var r = parseInt(DataSelectedHabitGetId().slice(DataSelectedHabitGetId().lastIndexOf("_") + 1));
    
    /* display the Target as per data */
    document.getElementById("optionTarget").value = data.HabitList[r].Target;
    
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
    document.getElementById("modalEditData").style.display = "block";
    
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
    
    var date = moment();
    date = date.subtract(c, "days");
    document.getElementById("labelDate").innerText = date.format("dddd, Do MMMM YYYY");
    document.getElementById("labelHabit").innerText = data.HabitList[r].Name;
    
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

function validateAddPage()
{
    for(var i=0; i<data.HabitList.length; i++) {
        /* Check if habit already exists */
        if(data.HabitList[i].Name == document.getElementById("textHabit").value) {
            if( DataSelectedHabitGetStr() == "" ) { // Add
                alert("Habit already exists");
                return false;
            }
            else { // update
                if(data.HabitList[i].Target == document.getElementById("optionTarget").value) {
                    alert("Habit already exists");
                    return false;
                }
                else {
                    if(DataSelectedHabitGetStr() != data.HabitList[i].Name) {
                        alert("Habit already exists");
                        return false;                        
                    }
                }
            }
        }
    }
    
    return true;
}

function addupdateHabit()
{
    var habit = new Object();
    habit.Name = document.getElementById("textHabit").value;
    habit.Target = document.getElementById("optionTarget").value;
    if( DataSelectedHabitGetStr() == "" )
    {
        if (!validateAddPage()) return;
        DataHabitAdd(habit);
    }
    else
    {
        if (!validateAddPage()) return;
        DataHabitUpdate(DataSelectedHabitGetStr(), habit);
        DataSelectedHabitReset();
    }
}

function setColorSign(r) {
    var arr = DataGetByRow(r);
    
    var oldavg = 0;
    var curavg = 0;
    if(arr.length == 0 || arr.length == 1) {
        /* nothing to do */
    }
    else if(arr.length <= 7) {
        curavg = arr[0];
        
        var sum = 0;
        for(var i=1; i<arr.length; i++) sum += arr[i];
        oldavg = sum / (arr.length-1);
    }
    else {
        var sum = 0;
        for(var i=0; i<7; i++) sum += arr[i];
        curavg = sum / 7;
        
        sum = 0;
        var i=7;
        for( ; i<arr.length && i<30; i++) sum += arr[i];
        oldavg = sum / (i-7);
    }
    
    var hi = oldavg + 0.1*oldavg;
    var lo = oldavg + 0.1*oldavg;
    var color = "transparent";
    switch(data.HabitList[r].Target) {
        case "Improve":
            if(curavg > hi) color = "lightgreen";
            else if(curavg < lo) color = "red";
            else color = "yellow";
            break;
            
        case "Reduce":
            if(curavg > hi) color = "red";
            else if(curavg < lo) color = "lightgreen";
            else color = "yellow";
            break;
            
        case "Reach":
            break;
            
        default:
            alert("Invalid Target data encountered");
    }
    
    document.getElementById("sign_" + r).style.color = color;
}