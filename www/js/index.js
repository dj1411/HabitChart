function testcode()
{
    data = JSON.parse(localStorage.getItem("data"));
    if (data == null)
        data = dataInit;

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
    
    /* Fill the table */
    for (var r = 0; r <= data.HabitList.length; r++)
    {
        var row = document.createElement("div");
        row.classList.add("w3-cell-row");
        row.classList.add("w3-border-bottom");
        row.style.height = "30px";
        row.style.lineHeight = "30px";

        /* date row */
        if (r == 0)
        {
            /* The first cell is blank by design */
            var cell = document.createElement("div");
            cell.classList.add("w3-cell");
            cell.style.width = HABIT_COL_WIDTH + "px";
            row.appendChild(cell);
            
            for (var c = 0; (c < DataListSize()) && (c < numDataCol); c++)
            {
                var cell = document.createElement("div");
                cell.classList.add("w3-cell");
                cell.classList.add("w3-text-theme");
                cell.classList.add("w3-small");
                cell.classList.add("w3-center");
                cell.style.width = DATA_COL_WIDTH + "px";
                var text;
                
                if(c==0)
                {
                    text = document.createTextNode("Today");
                }
                else
                {
                    var date = new Date();
                    date.setDate(date.getDate() - c);
                    if (date.toLocaleDateString().split("/")[0] == date.getDate())  /* check locale setting */
                        text = document.createTextNode( date.getDate() + "/" + (date.getMonth()+1) );
                    else
                        text = document.createTextNode( (date.getMonth()+1) + "/" + date.getDate() );
                }
                
                cell.appendChild(text);
                row.appendChild(cell);
                table.appendChild(row);
            }
        }
        else
        {
            /* Habits */
            var cell = document.createElement("div");
            cell.classList.add("w3-cell");
            cell.classList.add("habitColumn");
            cell.setAttribute("id", "HabitList_" + (r - 1));
            cell.setAttribute("name", "HabitList_" + (r - 1));
            cell.setAttribute("onclick", "selectHabit('HabitList_" + (r - 1) + "')");
            cell.textContent = data.HabitList[r - 1];
            cell.style.width = HABIT_COL_WIDTH + "px";
//            cell.classList.add("w3-padding");
            row.appendChild(cell);

            /* the bar chart */
            for (var c = 0; (c < DataListSize()) && (c < numDataCol); c++) {
                var cell = document.createElement("div");
                cell.classList.add("w3-cell");
                cell.style.width = DATA_COL_WIDTH + "px";
                cell.style.height = "20px";

//                if(c%2 == 0)
//                    cell.classList.add("w3-green");
//                else
//                    cell.classList.add("w3-yellow");

//                var date = new Date();
//                date.setDate(date.getDate() - c);
//                var name = "checkbox_" + (r - 1) + "_" + date.getDate() + "_" + (date.getMonth()+1);
//                checkbox.setAttribute("id", name);
//                checkbox.setAttribute("name", name);
//                checkbox.setAttribute("onclick", "checkboxChange('" + name + "')");
//
                var date = new Date();
                date.setDate(date.getDate() - c);
                if (DataGetByDate(date)[r - 1])
                    cell.classList.add("w3-green");
//
//                cell.appendChild(checkbox);
                
                row.appendChild(cell);
            }
        }
        
        table.appendChild(row);
    }
}

function checkboxChange(name)
{
    var idHabit = name.split("_")[1];

    var date = new Date();
    date.setMonth(parseInt(name.split("_")[3]) -1);
    date.setDate(name.split("_")[2]);

    var stCheck = document.getElementById(name).checked;

    var arr = DataGetByDate(date);
    arr[idHabit] = (stCheck) ? 1 : 0;
    DataSetByDate(date, arr);
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
    document.getElementById("divAdd").style.display = "block";
    document.getElementById("textHabit").focus();
}

function onclickEditButton()
{
    document.getElementById("titleModalHabit").innerText = "Update habit";
    document.getElementById("textHabit").value = DataSelectedHabitGetStr();
    document.getElementById("divAdd").style.display = "block";
    document.getElementById("textHabit").focus();
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