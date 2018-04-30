/*  - prefill the textbox
    - hide the add button
    - display the update button
*/
function prefillPage()
{
    document.getElementById("textHabit").value = selectedHabit;
    document.getElementById("textHabit").select();

    document.getElementById("buttonAdd").style.display = "none";
    document.getElementById("buttonUpdate").style.display = "block";
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

    DataHabitAdd(document.getElementById("textHabit").value);

    location.replace("index.html");
}

function updateHabit()
{
    if (!validateAddPage())
        return;
    
    DataHabitUpdate(selectedHabit, document.getElementById("textHabit").value);
    DataSelectedHabitReset("");

    location.replace("index.html");
}