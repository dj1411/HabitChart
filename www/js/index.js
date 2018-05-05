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
	
    var table = document.getElementById("tableMain");

    /* delete existing rows */
    var cntRows = table.rows.length;
    for (var row = 0; row < cntRows; row++)
        table.deleteRow(0);

    /* Fill the table */
    var numDataCol = (window.innerWidth - HABIT_COL_WIDTH) / DATA_COL_WIDTH;
    for (var r = 0; r <= data.HabitList.length; r++)
    {
        var row = table.insertRow(r);
        var cell = row.insertCell(0);
        cell.style.width = HABIT_COL_WIDTH + "px";

        /* date row */
        if (r == 0)     /* The first cell is blank by design */
        {
            for (var c = 0; (c < DataListSize()) && (c < numDataCol); c++)
            {
                cell = row.insertCell(c + 1);
                cell.style.width = DATA_COL_WIDTH + "px";

                var date = new Date();
                date.setDate(date.getDate() - c);
                if (date.toLocaleDateString().split("/")[0] == date.getDate())  /* check locale setting */
                    cell.innerHTML = "<div class='th thtop'>" + date.getDate() + "/" + (date.getMonth() + 1) + "</div>";
                else
                    cell.innerHTML = "<div class='th thtop'>" + (date.getMonth() + 1) + "/" + date.getDate() + "</div>";
            }
        }
        else
        {
            /* Habits */
            var habit = document.createElement("div");
            habit.setAttribute("class", "habitColumn");
            habit.setAttribute("id", "HabitList_" + (r - 1));
            habit.setAttribute("name", "HabitList_" + (r - 1));
            habit.setAttribute("onclick", "selectHabit('HabitList_" + (r - 1) + "')");
            //habit.setAttribute("onclick", "selectHabit('xx')");
            habit.textContent = data.HabitList[r - 1];
            cell.appendChild(habit);

            /* Checkboxes */
            for (var c = 0; (c < DataListSize()) && (c < numDataCol); c++) {
                cell = row.insertCell(c + 1);
                cell.style.width = DATA_COL_WIDTH + "px";

                checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("class", "td");

                var date = new Date();
                date.setDate(date.getDate() - c);
                var name = "checkbox_" + (r - 1) + "_" + date.getDate() + "_" + (date.getMonth()+1);
                checkbox.setAttribute("id", name);
                checkbox.setAttribute("name", name);
                checkbox.setAttribute("onclick", "checkboxChange('" + name + "')");

                var date = new Date();
                date.setDate(date.getDate() - c);
                if (DataGetByDate(date)[r - 1])
                    checkbox.checked = true;

                cell.appendChild(checkbox);
            }
        }
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
        document.getElementById(selectedHabitId).style.backgroundColor = color4;

    if (habitId == selectedHabitId) /* de-selection */
    {
        /* reset selection */
        DataSelectedHabitUpdate("");

        /* change toolbar icons */
        toggleToolbar();
    }
    else  /* selection */
    {
        /* set selection */
        document.getElementById(habitId).style.backgroundColor = color2; 
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
    DataSelectedHabitUpdate("");
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

function onclickAdd()
{
    DataSelectedHabitUpdate(""); 
    document.getElementById("titleModalHabit").innerText = "Add habit";
    document.getElementById("divAdd").style.display = "block";
    document.getElementById("textHabit").focus();
}

function validateAddPage()
{
    if (document.getElementById("textHabit").value === "")
        return false;

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
    DataHabitAdd(habit);
}
