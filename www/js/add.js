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

function updateHabit()
{
    if (!validateAddPage())
        return;
    
    DataHabitUpdate(selectedHabit, document.getElementById("textHabit").value);
    DataSelectedHabitReset();

    location.replace("index.html");
}