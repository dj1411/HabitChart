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
    
    /* blank cell */
    var cell = document.createElement("div");
    row.appendChild(cell);
    cell.classList.add("w3-cell");
    cell.style.width = HABIT_COL_WIDTH + "px";

    /* fill the dates */
    for (var c = 0; (c < DataListSize()) && (c < numDataCol); c++)
    {
        var cell = document.createElement("div");
        row.appendChild(cell);
        cell.classList.add("w3-cell");
        cell.classList.add("w3-text-theme");
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

        /* Habits */
        var cell = document.createElement("div");
        table.appendChild(row);
        cell.classList.add("w3-cell");
        cell.classList.add("habitColumn");
        cell.setAttribute("id", "HabitList_" + r);
        cell.setAttribute("name", "HabitList_" + r);
        cell.setAttribute("onclick", "selectHabit('HabitList_" + r + "')");
        cell.textContent = data.HabitList[r];
        cell.style.width = HABIT_COL_WIDTH + "px";
        row.appendChild(cell);

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
    var arrDropdown = new Array();
    
    arrDropdown.push(0);
    arrDropdown.push(arrData[0]);
    var max = Math.max(...arrData);
    var min = Math.min(...arrData);
    if(max == 0) arrDropdown.push(1);
    arrDropdown.push(max);
    arrDropdown.push(min);
    arrDropdown.push(Math.ceil(max + max*0.1));
    arrDropdown.push(Math.floor(min - min*0.1));
    arrDropdown.push(min + Math.round((max-min)/3));
    arrDropdown.push(max - Math.round((max-min)/3));
    
    /* removing duplicates */
    arrDropdown = ( arrDropdown.sort(function(a, b){return a-b}).filter( function(currentValue, index, arr) {
        return ( index == arr.lastIndexOf(currentValue) );
    }));
    
    return arrDropdown;
}

function selectHabit(habitId)
{
    var selectedHabitId = DataSelectedHabitGetId();

    if (selectedHabitId != null)
    {
        document.getElementById(selectedHabitId).classList.add("w3-text-theme");        
        document.getElementById(selectedHabitId).classList.remove("w3-theme-light");
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
        document.getElementById(habitId).classList.add("w3-theme-light"); 
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
    document.getElementById("labelHabit").innerText = data.HabitList[r];
    
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

function validateAddPage()
{
    if (document.getElementById("textHabit").value === "")
    {
        alert("Habit name is blank");
        return false;
    }

    /* Check if habit already exists */
    if (data.HabitList.indexOf(document.getElementById("textHabit").value) !== -1)
    {
        alert("Habit already exists");
        return false;
    }

    return true;
}

function addHabit()
{
    if (!validateAddPage())
        return;
    
    var habit = document.getElementById("textHabit").value;
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