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

/* global variables */
var db = new DB();
var selectedCell = null;


/* display the main table */
function showData() {
    /* clear the existing table */
    document.getElementById("tableData").innerHTML = "";
    document.getElementById("tableDate").innerHTML = "";

    /* calculate number of columns */
    var numCol = Math.floor(document.getElementById("tableData").clientWidth / WIDTH_DATA_CELL);

    /* get the table object */
    var table = document.getElementById("tableData");
    var tableDate = document.getElementById("tableDate");

    /* create the date row */
    var row = tableDate.insertRow(-1);
    row.classList.add("w3-tiny");
    for (var i = 0; i < numCol; i++) {
        var cell = row.insertCell(i);
        cell.innerHTML = moment().subtract(numCol - (i + 1), "days").format("ddd<br>DD/MM");
    }

    /* create habits and their data rows */
    for (var idxHabit = 0; idxHabit < db.root.data.arrHabit.length; idxHabit++) {
        /* local variables */
        var idHabit = db.root.data.arrHabit[idxHabit].id;

        /* row for the traffic light and habit name */
        row = table.insertRow(-1);
        row.id = "rowHabitName_" + idHabit;
        row.addEventListener( "contextmenu", function(event) {
            oncontextmenuHabit(event);
        } );
        var cell = row.insertCell(0);
        cell.classList.add("w3-text-dark");
        cell.style.whiteSpace = "nowrap";

        /* traffic light */
        var span = document.createElement("span");
        cell.appendChild(span);
        var icon = document.createElement("i");
        span.appendChild(icon);
        icon.classList.add("fas");
        icon.classList.add("fa-circle");
        icon.id = "light_" + idHabit;
        setColorLight(idHabit);

        /* habit name */
        span = document.createElement("span");
        cell.appendChild(span);
        span.classList.add("w3-margin-left");
        span.innerText = db.root.data.arrHabit[idxHabit].name;

        /* empty data cells */
        var arrData = [];
        row = table.insertRow(-1);
        row.id = "rowHabitData_" + idHabit;
        row.addEventListener( "contextmenu", function(event) {
            oncontextmenuHabit(event);
        } );        
        for (var j = 0; j < numCol; j++) {
            cell = row.insertCell(j);
            var date = moment().subtract(numCol - (j + 1), "days");
            cell.id = "datacell_" + idHabit + "_" + date.format("YYMMDD");
            arrData.push(getData(idHabit, date));
            cell.onclick = onclickEditData;
        }

        /* calculate the max value */
        var max = Math.max(...(arrData.map(function (data) {
            return (data ? data.value : 0);
        })));

        /* fill the chart */
        for (var j = 0; j < numCol; j++) {
            var date = moment().subtract(numCol - (j + 1), "days");
            var data = getData(idHabit, date);
            cell = document.getElementById("datacell_" + idHabit + "_" + date.format("YYMMDD"));

            /* if no data present, fill the cell with gray */
            if (!data) {
                cell.style.borderBottom = HEIGHT_DATA_CELL + "px solid";
                cell.classList.add("w3-border-light-gray");
            }
            /* if 0 is entered as data, put a 1px gray bar */
            else if (data.value == 0) {
                cell.style.borderBottom = "1px solid";
                cell.classList.add("w3-border-light-gray");
            }
            /* for normal data, create a proportionate chart */
            else {
                var height = (data.value / max) * HEIGHT_DATA_CELL;
                cell.style.borderBottom = height + "px solid";
            }
        }

        /* blank row for padding */
        row = table.insertRow(-1);
        cell = row.insertCell(0);
        cell.innerHTML = "&nbsp;";
    }

    /* blank row to scroll past the (+) button */
    row = table.insertRow(-1);
    cell = row.insertCell(0);
    cell.innerHTML = "&nbsp;";
    row.style.height = window.innerHeight -
        document.getElementById("buttonAdd").getBoundingClientRect().top + "px";
}


/* The main entry point. This function is entered when Cordova is ready. */
function main() {
    /* show all the data */
    showData();

    /* set the style at the end, because the geometry may change in other functions */
    setStyle();
}


/* set the color of traffic light for a given habit */
function setColorLight(idHabit) {
    /* local variables */
    var idxHabit = db.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id == idHabit);
    });

    /* calculate the average of last 7 days and 'MAX_HISTORY_DATA' days */
    var sum7 = sumMax = cnt7 = cntMax = curavg = oldavg = 0;
    for (var offset = 0; offset < MAX_HISTORY_DATA; offset++) {
        var data = getData(idHabit, moment().subtract(offset, "days"));
        if (data != undefined) {
            if (offset < 7) {
                sum7 += parseInt(data.value);
                cnt7++;
            }

            sumMax += parseInt(data.value);
            cntMax++;
        }
    }
    if (cntMax != 0) {
        curavg = sum7 / cnt7;
        oldavg = sumMax / cntMax;
    }

    /* decide the color based on old and new average */
    var color = "transparent";
    var hi = oldavg + 0.1 * oldavg;
    var lo = oldavg - 0.1 * oldavg;
    switch (db.root.data.arrHabit[idxHabit].target) {
        case "Improve":
            if (curavg >= hi) color = COLOR_TARGET_GREEN;
            else if (curavg < lo) color = COLOR_TARGET_RED;
            else color = COLOR_TARGET_YELLOW;
            break;

        case "Reduce":
            if (curavg > hi) color = COLOR_TARGET_RED;
            else if (curavg <= lo) color = COLOR_TARGET_GREEN;
            else color = COLOR_TARGET_YELLOW;
            break;

            //        default:
            //            /* case Reach */
            //            if( data.HabitList[r].Target.slice(0,5) == "Reach" ) {
            //                var target = data.HabitList[r].Target.split("_")[1] / data.HabitList[r].Target.split("_")[2];
            //                var higreen = target + 0.1*target;
            //                var logreen = target - 0.1*target;
            //                var hiyellow = target + 0.25*target;
            //                var loyellow = target - 0.25*target;
            //                
            //                if(oldavg >= logreen && oldavg <= higreen)
            //                    color = COLOR_TARGET_GREEN;
            //                else if(oldavg > loyellow && oldavg < hiyellow) color = COLOR_TARGET_YELLOW
            //                else color = COLOR_TARGET_RED;
            //                
            //                break;
            //            }
            //            else { /* default */
            //                alert("Invalid Target data encountered");                
            //            }
    }

    document.getElementById("light_" + idHabit).style.color = color;
}


/* do not change the order of setStyle() */
function setStyle() {
    /* set the app name */
    document.title = APP_NAME;
    document.getElementById("titleWindow").innerText = APP_NAME;

    /* move the main body below header */
    document.getElementById("divBody").style.top =
        document.getElementById("divHeader").clientHeight + "px";

    /* set z-index of all elements */
    document.getElementById("divHeader").style.zIndex = Z_INDEX_MED;
    $(".w3-modal").css("z-index", Z_INDEX_TOP);
    
    /* prepare for element selection */
    /* disable text selection and context menu */
    document.body.style.userSelect = "none";
    document.body.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });
}


/* idHabit = id of the habit */
/* date = date in moment format */
function getData(idHabit, date) {
    var idxHabit = db.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id == idHabit);
    });

    return db.root.data.arrHabit[idxHabit].arrData.find(function (data) {
        return isDateMatching(moment(data.date), date);
    });
}


/* display additional modal objects */
function onchangeTarget(event) {
    if (event.target.value == "Maintain") {
        document.getElementById("divMaintain").style.display = "block";
    } else {
        document.getElementById("divMaintain").style.display = "none";
    }
}

function onclickAddEditHabit(event) {
    if (event.target == document.getElementById("buttonAdd") ||
        event.target.parentNode == document.getElementById("buttonAdd")
    ) {
        document.getElementById("titleAddEditHabit").innerText = "Add Habit";
    }

    document.getElementById("modalAddEditHabit").style.display = "block";
    document.getElementById("textHabit").select();
}

function onclickEditData(event) {
    selectedCell = event.target.id;

    var idHabit = selectedCell.split("_")[1];
    var date = moment(selectedCell.split("_")[2], "YYMMDD");
    if (getData(idHabit, date)) {
        document.getElementById("textData").value = getData(idHabit, date).value;
    } else {
        document.getElementById("textData").value = null;
    }

    document.getElementById("modalEditData").style.display = "block";
    document.getElementById("textData").select();
}


/* do something upon selecting a habit */
function oncontextmenuHabit(event) {
    /* determining the habit id */
    var idxPath = event.path.findIndex(function(val, idx, arr) {
        return (val.id.split("_")[0] === "rowHabitName" || val.id.split("_")[0] === "rowHabitData")
    });
    var idHabit = event.path[idxPath].id.split("_")[1];
}


function onsubmitAddEditHabit() {
    document.getElementById("modalAddEditHabit").style.display = "none";

    db.addHabit(document.getElementById("textHabit").value,
        document.getElementById("optionHabitType").value,
        document.getElementById("optionTarget").value
    )
}

function onsubmitEditData(event) {
    /* hide the modal */
    document.getElementById("modalEditData").style.display = "none";

    /* some local variables */
    var idHabit = selectedCell.split("_")[1];
    var date = moment(selectedCell.split("_")[2], "YYMMDD");
    var val = document.getElementById("textData").value;

    /* enter in database */
    if (getData(idHabit, date)) {
        db.editData(idHabit, date, val);
    } else {
        db.addData(idHabit, date, val);
    }

    /* display the table and so some cleanup */
    showData();
    document.getElementById("textData").value = null;
    event.preventDefault(); // prevent page reload on submit
}