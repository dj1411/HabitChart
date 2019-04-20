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


/* The main entry point. This function is entered when Cordova is ready. */
function main() {
    "use strict";
    
    ssInit();
    showData();
    setStyle();
    handleGlobalEvents();
}

/* idHabit = id of the habit */
/* date = date in moment format */
function getData(idHabit, date) {
    "use strict";
    
    var idxHabit = db.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id == idHabit);
    });

    return db.root.data.arrHabit[idxHabit].arrData.find(function (data) {
        return isDateMatching(moment(data.date), date);
    });
}

function handleGlobalEvents() {
    /* disable text selection and context menu */
    document.body.style.userSelect = "none";
    document.body.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });
    
    /* move the selection overlay upon scrolling */
    document.addEventListener("scroll", function(event) {
        var idHabit = ssGet("idHabitSelect");
        if( idHabit != undefined) {
            var y = document.getElementById("rowHabitName_" + idHabit)
                .getBoundingClientRect().top;
            document.getElementById("overlayHabitSelect").style.top = y + "px";
        }
    });
    
    /* use cordova plugins on android and iPhone */
    if(navigator.userAgent.indexOf("Android") >= 0 ||
       navigator.userAgent.indexOf("iPhone") >= 0) {
        /* button click sound */
        nativeclick.watch(["mybutton"]);
        
        /* button click vibration */
        var arrButtons = document.getElementsByClassName("mybutton");
        for( var i=0; i<arrButtons.length; i++) {
            arrButtons[i].addEventListener( "click", function() {
                navigator.vibrate(20);
            } );
        }
    }

    /* only Android specific events */
    if(navigator.userAgent.indexOf("Android") >= 0) {
        /* back button */
        document.addEventListener("backbutton", onBack);
    }
}

/* select a given habit by changing the background color */
function selectHabit(idHabit) {
    "use strict";
    
    /* change background of habit */
    /* this is purely a workaround. ideally, the background color of the row
     * should have been changed, plus the border perhaps. But In our case,
     * we are using the border for draw the chart. So, we cant play around with
     * the border too much.
     */
    document.getElementById("overlayHabitSelectBG").style.display = "block";
    var y = document.getElementById("rowHabitName_" + idHabit)
        .getBoundingClientRect().top;
    document.getElementById("overlayHabitSelect").style.top = y + "px";
    var height = document.getElementById("rowHabitName_" + idHabit).clientHeight
        + document.getElementById("rowHabitData_" + idHabit).clientHeight
        + 10;
    document.getElementById("overlayHabitSelect").style.height = height + "px";
    
    /* change toolbar */
    document.getElementById("titleWindow").innerHTML = "";
    document.getElementById("divTitle").classList.remove("w3-theme-dark");
    document.getElementById("divTitle").classList.add("w3-theme-d1");
    document.getElementById("toolbarNormal").style.display = "none";
    document.getElementById("toolbarSelect").style.display = "block";
}

/* set the color of traffic light for a given habit */
function setColorLight(idHabit) {
    "use strict";
    
    /* local variables */
    var idxHabit = db.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id === idHabit);
    });

    /* calculate the average of last 7 days and 'MAX_HISTORY_DATA' days */
    var sum7 = 0;
    var sumMax = 0;
    var cnt7 = 0;
    var cntMax = 0;
    var curavg = 0;
    var oldavg = 0;
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
    "use strict";
    
    /* title bar settings */
    document.title = APP_NAME;
    document.getElementById("titleWindow").innerText = APP_NAME;

    /* move the elements below header */
    document.getElementById("divBody").style.top =
        document.getElementById("divHeader").clientHeight + "px";
    document.getElementById("overlayHabitSelectBG").style.top = 
         document.getElementById("divTitle").clientHeight + "px";

    /* set z-index of all elements */
    document.getElementById("divHeader").style.zIndex = Z_INDEX_MED;
    $(".w3-modal").css("z-index", Z_INDEX_TOP);
    document.getElementById("overlayHabitSelectBG").style.zIndex = Z_INDEX_MEDLO;
}


/* deselect any selected habit and reset the toolbar */
function deselectHabit() {
    "use strict";
    
    /* reset selection */
    ssReset("idHabitSelect");
    document.getElementById('overlayHabitSelectBG').style.display = 'none';
    
    /* change toolbar */
    document.getElementById("titleWindow").innerText = APP_NAME;
    document.getElementById("divTitle").classList.add("w3-theme-dark");
    document.getElementById("divTitle").classList.remove("w3-theme-d1");
    document.getElementById("toolbarNormal").style.display = "block";
    document.getElementById("toolbarSelect").style.display = "none";
}


/* handle back button for Android */
function onBack() {
    /* close any open modal */
    var modals = document.getElementsByClassName("w3-modal");
    for(var i=0; i<modals.length; i++) {
        if(modals[i].style.display === "block") {
            modals[i].style.display = "none";
            return;
        }
    }
    
    /* deselect habit if any */
    if(ssGet("idHabitSelect") != undefined) {
        deselectHabit();
        return;
    }
    
    /* if not on main page, just go back to previous page */
    if(location.href.split('/').reverse()[0] != "index.html") {
        window.history.back();
    }
    /* else if on main page, exit app */
    else {
        navigator.app.exitApp();
    }
}


/* display additional modal objects */
function onchangeTarget(event) {
    "use strict";
    
    if (event.target.value == "Maintain") {
        document.getElementById("divMaintain").style.display = "block";
    } else {
        document.getElementById("divMaintain").style.display = "none";
    }
}

function onclickAddEditHabit(event) {
    "use strict";
    
    if (event.target == document.getElementById("buttonAdd") ||
        event.target.parentNode == document.getElementById("buttonAdd")
    ) {
        document.getElementById("titleAddEditHabit").innerText = "Add Habit";
    }

    document.getElementById("modalAddEditHabit").style.display = "block";
    document.getElementById("textHabit").select();
}


function onclickDeleteHabit() {
    "use strict";
    
    db.removeHabit(parseInt(ssGet("idHabitSelect")));
    deselectHabit();
    showData();
}


function onclickEditData(event) {
    "use strict";
    
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
    "use strict";
    
    /* determining the habit id */
    var idxPath = event.path.findIndex(function(val, idx, arr) {
        return (val.id.split("_")[0] === "rowHabitName" 
                || val.id.split("_")[0] === "rowHabitData")
    });
    var idHabit = event.path[idxPath].id.split("_")[1];
    
    /* Select the habit */
    ssSet("idHabitSelect", idHabit);
    selectHabit(idHabit);
}


function onsubmitAddEditHabit() {
    "use strict";
    
    document.getElementById("modalAddEditHabit").style.display = "none";

    db.addHabit(document.getElementById("textHabit").value,
        document.getElementById("optionHabitType").value,
        document.getElementById("optionTarget").value
    )
}

function onsubmitEditData(event) {
    "use strict";
    
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


/* display the main table */
function showData() {
    "use strict";
    
    /* clear the existing table */
    document.getElementById("tableData").innerHTML = "";
    document.getElementById("tableDate").innerHTML = "";

    /* calculate number of columns */
    var numCol = Math.floor(document.getElementById("tableData").clientWidth 
                            / WIDTH_DATA_CELL);

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
        /* skip deleted habits */
        if(db.root.data.arrHabit[idxHabit].isDeleted == true) {
            continue;
        }
        
        /* local variables */
        var idHabit = db.root.data.arrHabit[idxHabit].id;

        /* row for the traffic light and habit name */
        row = table.insertRow(-1);
        row.id = "rowHabitName_" + idHabit;
        row.addEventListener( "contextmenu", function(event) {
            oncontextmenuHabit(event);
        } );

        /* traffic light */
        var cell = row.insertCell(-1);
        var icon = document.createElement("i");
        cell.appendChild(icon);
        icon.classList.add("fas");
        icon.classList.add("fa-circle");
        icon.id = "light_" + idHabit;
        setColorLight(idHabit);

        /* habit name */
        cell = row.insertCell(-1);
        cell.classList.add("w3-text-dark");
        cell.style.whiteSpace = "nowrap";
        cell.innerText = db.root.data.arrHabit[idxHabit].name;
        
        /* dummy cells for the habit name row */
        for (var j = 2; j < numCol; j++) {
            cell = row.insertCell(-1);
        }
        
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


/* toolbar when there is no habit selected */
function showToolbarNormal() {
    "use strict";
    
    /* toolbar color */
    document.getElementById("divTitle").classList.remove("w3-theme-dark");
    document.getElementById("divTitle").classList.add("w3-theme-d1");
}



