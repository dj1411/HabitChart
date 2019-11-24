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

/* on Android start main only when 'deviceready' */
if (navigator.userAgent.indexOf("Android") >= 0) {
    document.addEventListener("deviceready", main);
} 
else {
    main();
}

/* The main entry point. This function is entered when Cordova is ready. */
function main() {
    "use strict";
    
    /* experimental features. for release saveToFile = enabled, loadFromFile = disabled */
    db.saveToFile();
//    db.loadFromFile();
    
    /* The main sequence */
    ssInit();
    showData();
    setStyle();
    setEvents(); // this may fail without real device
}


/* Create bar chart for a table cell */
function createBar(cell, height, color) {
    "use strict";
    
    /* local variables */
    var ns = "http://www.w3.org/2000/svg";

    /* create svg element */
    cell.innerHTML = "";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.id = "datasvg" + getSuffix(cell.id);
    cell.appendChild(svg);
    svg.style.display = "block"; // by this the entire cell is filled with SVG
    
    /* create rectangle */
    var rect = document.createElementNS(ns, "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", height);
    rect.setAttribute("x", 0);
    rect.setAttribute("y", HEIGHT_DATA_CELL - height);
    rect.setAttribute("fill", color);
    rect.id = "datarect" + getSuffix(cell.id);
    svg.appendChild(rect);
}


/* Create checkbox in the given cell with the given status */
function createCheckbox(cell, status) {
    /* create the checkbox */
    cell.innerHTML = "";
    var icon = document.createElement( "i" );
    cell.appendChild( icon );
    icon.id = "checkbox" + getSuffix(cell.id);
    
    /* checked or unchecked */
    if(status)
        icon.classList.add( "fas", "fa-check" );
    else
        icon.classList.add( "fas", "fa-times" );
    
    /* compute traffic light again */
    /* this is necessary because createCehckbox() can be called from 
     * outside showData() */
    var idHabit = parseInt( cell.id.split("_")[1] );
    setColorLight(idHabit);
}


/* deselect any selected habit and reset the toolbar */
function deselectHabit() {
    "use strict";
    
    /* reset selection */
    ssReset("idSelectedHabit");
    
    /* change toolbar */
    document.getElementById("titleWindow").innerText = APP_NAME;
    document.getElementById("divTitle").classList.add("w3-theme-dark");
    document.getElementById("divTitle").classList.remove("w3-theme-d1");
    document.getElementById("toolbarNormal").style.display = "block";
    document.getElementById("toolbarSelect").style.display = "none";
    
    /* reset background of all habits */
    for( var idxHabit=0; idxHabit < db.root.data.arrHabit.length; idxHabit++ ) {
        var idHabit = db.root.data.arrHabit[idxHabit].id;
        var row = document.getElementById( "rowHabitName_" + idHabit );
        row.style.backgroundColor = "transparent";
        var row = document.getElementById( "rowHabitData_" + idHabit );
        row.style.backgroundColor = "transparent";
    }
}


/* get the idxData from idHabit and idData */
function getIdxData( idHabit, idData ) {
    var idxHabit = db.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id === idHabit);
    });
    
    return db.root.data.arrHabit[idxHabit].arrData.findIndex( function(data) {
        return (data.id == idData);
    });
}


/* get the idxHabit from idHabit */
function getIdxHabit( idHabit ) {
    return db.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id === idHabit);
    });
}


/* get the suffix of id of html element. */
/* typically this is the string after the first underscore */
function getSuffix(str) {
    var pos = str.indexOf("_");
    return str.substr(pos);    
}

/* get a corresponding color from the current theme */
function getThemeColor( idColor ) {
    var div = document.getElementById( idColor );
    return window.getComputedStyle(div, null).getPropertyValue("background-color");
}


function setEvents() {
    /* handle click event on the data table */
    /* This is primarily used for deselecting habit */
    /* propagation is set to "capture", to prevent pressing any other buttons */
    document.getElementById( "divBody" ).addEventListener( 
        "click", onclickBody, true );
    
    /* disable text selection and context menu */
    document.body.style.userSelect = "none";
    document.body.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });
    
    /* use cordova plugins on android */
    if(navigator.userAgent.indexOf("Android") >= 0) {
        /* button click sound */
        nativeclick.watch(["mybutton"]);
        
        /* button click vibration */
        var arrButtons = document.getElementsByClassName("mybutton");
        for( var i=0; i<arrButtons.length; i++) {
            arrButtons[i].addEventListener( "click", function() {
                navigator.vibrate(20);
            } );
        }
        
        /* handle back button */
        document.addEventListener("backbutton", onBack);
    }
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
    if(ssGet("idSelectedHabit") != undefined) {
        deselectHabit();
        return;
    }
    
    /* if not on main page, just go back to previous page */
    var page = location.href.split('/').reverse()[0];
    if (page != "index.html" && page != "index.html?") {
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
        document.getElementById("textTimes").required = true;
        document.getElementById("textDays").required = true;
    } else {
        document.getElementById("divMaintain").style.display = "none";
        document.getElementById("textTimes").required = false;
        document.getElementById("textDays").required = false;
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


function onclickBody(event) {
    /* deselect if any habit is selected */
    if(ssGet("idSelectedHabit") != undefined) {
        deselectHabit();
        event.stopPropagation();
    }
}


function onclickDeleteHabit() {
    "use strict";
    
    db.removeHabit(parseInt(ssGet("idSelectedHabit")));
    deselectHabit();
    showData();
}


function onclickEditData(event) {
    "use strict";
    
    /* global variables */
    selectedCell = event.target.id;
    
    /* local variables */
    var idHabit = parseInt( selectedCell.split("_")[1] );
    var idxHabit = getIdxHabit( idHabit );
    var date = moment(selectedCell.split("_")[2], "YYMMDD");
    var data = db.getData(idHabit, date);
    
    /* habit method */
    switch( db.root.data.arrHabit[idxHabit].type ) {
        case "value":
            if (data) {
                document.getElementById("textData").value = data.value;
            } 
            else {
                document.getElementById("textData").value = null;
            }
            document.getElementById("modalEditData").style.display = "block";
            document.getElementById("textData").select();     
            break;
            
        case "checkbox":
            /* grayed --> checked --> unchecked --> grayed */
            if(data == undefined) {
                /* grayed --> checked */
                var cell = document.getElementById( "datacell" + getSuffix(selectedCell) );
                db.addData(idHabit, date, 1);
                createCheckbox(cell, true);
            }
            else {
                if(data.value == 1) {
                    /* checked --> unchecked */
                    setCheckbox( "checkbox" + getSuffix(selectedCell), false );
                }
                else {
                    /* unchecked --> grayed */
                    setCheckbox( "checkbox" + getSuffix(selectedCell), null );
                }
            }
            break;
    }
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
    selectHabit(idHabit);
}


function onsubmitAddEditHabit() {
    "use strict";
    
    document.getElementById("modalAddEditHabit").style.display = "none";

    /* populate the "target" data structure */
    var target = null;
    var ot = document.getElementById("optionTarget").value;
    if( ot == "Maintain" ) {
        target = new TargetType(document.getElementById("optionTarget").value,
                                document.getElementById("textTimes").value,
                                document.getElementById("textDays").value,
                                document.getElementById("optionMaintain").value
                               );
    }
    else {
        target = new TargetType(document.getElementById("optionTarget").value);
    }
    
    /* add the habit to database */
    db.addHabit(document.getElementById("textHabit").value,
        document.getElementById("optionHabitType").value, target
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
    if (db.getData(idHabit, date)) {
        db.editData(parseInt(idHabit), date, val);
    } else {
        db.addData(parseInt(idHabit), date, val);
    }

    /* display the table and so some cleanup */
    showData(); // todo: just refresh the cell, not entire table
    document.getElementById("textData").value = null;
    event.preventDefault(); // prevent page reload on submit
}


/* select a given habit by changing the background color */
function selectHabit(idHabit) {
    "use strict";
    
    /* this will deselect any previously selected habit */
    deselectHabit();
    
    /* set session storage */
    ssSet("idSelectedHabit", idHabit);
    
    /* change background of habit */
    var row = document.getElementById( "rowHabitName_" + idHabit );
    row.style.backgroundColor = getThemeColor("w3-theme-l4");
    row = document.getElementById( "rowHabitData_" + idHabit );
    row.style.backgroundColor = getThemeColor("w3-theme-l4");
    
    /* change toolbar */
    document.getElementById("titleWindow").innerHTML = "";
    document.getElementById("divTitle").classList.remove("w3-theme-dark");
    document.getElementById("divTitle").classList.add("w3-theme-d1");
    document.getElementById("toolbarNormal").style.display = "none";
    document.getElementById("toolbarSelect").style.display = "block";
}


/* set the checked status of checkbox */
/* This will also edit the data in db */
/* plus it will set the traffic light */
/* status = true --> checked */
/* status = false --> unchecked */
/* status = null --> grayed */
function setCheckbox(idCheckbox, status) {
    /* local variables */
    var icon = document.getElementById(idCheckbox);
    var cell = document.getElementById( "datacell" + getSuffix(idCheckbox) );
    var date = moment(idCheckbox.split("_")[2], "YYMMDD");
    var idHabit = parseInt( idCheckbox.split("_")[1] );
    var idData = db.getData(idHabit, date).id;
    
    /* checkbox status change, plus edit the database */
    if(status == null) {
        db.removeData(idHabit, idData);
        createBar(cell, HEIGHT_DATA_CELL, COLOR_GRAY);
    } 
    else if(status == false) {
        db.editData(idHabit, date, 0);
        icon.classList.remove( "fa-check" );
        icon.classList.add( "fa-times" );
    }
    else {
        db.editData(idHabit, date, 1);
        icon.classList.remove( "fa-times" );
        icon.classList.add( "fa-check" );
    }    
    
    /* change traffic light color */
    setColorLight(idHabit);
}


/* set the color of traffic light for a given habit */
function setColorLight(idHabit) {
    "use strict";
    
    /* local variables */
    var idxHabit = db.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id === idHabit);
    });

    /* local variables to be used for calculation of traffic light */
    var curavg = 0;
    var oldavg = 0;
    var maxDataRef = 0;
    
    /* get the reference data for computation */
    
    /* filter all non-zero values */
    var arrDataRef = db.root.data.arrHabit[idxHabit].arrData.filter( 
        function(data, idx, arr) {
            return data.value > 0;
        } );
    /* sort by date */
    arrDataRef.sort( function(a,b) {
        if( moment(a.date).isAfter( moment(b.date) ) )
            return -1;
        else
            return 1;
    } );
    /* remove today's data */
    if( arrDataRef.length > 0 ) {
        if( isDateMatching(arrDataRef[0].date, moment()) ) {
            arrDataRef.shift();
        }
    }
    /* splice till reference number of data. */
    arrDataRef.splice( REF_HISTORY_DATA, arrDataRef.length - REF_HISTORY_DATA );
    /* calculate the days since the last reference data.
     * today is not counted.
     */
    if( arrDataRef.length > 0 ) {
        maxDataRef = Math.floor( moment.duration( moment().diff( 
            moment(arrDataRef[arrDataRef.length-1].date) ) ).asDays() );
    }
    
    /* for no data entered */
    if( db.root.data.arrHabit[idxHabit].arrData.length == 0 ) {
        /* nothing to do */
    }
    
    /* some data entered but not enough history data available */
    else if( arrDataRef.length == 0 ) {
        /* calculate current average, which is actually the value for today */
        var data = db.root.data.arrHabit[idxHabit].arrData.find( function(data) {
            return isDateMatching(data.date, moment());
        } );
        if( data != undefined ) {
            curavg = data.value;
        }
    }
    
    /* data entered for very few days */
    else if( arrDataRef.length < REF_HISTORY_DATA ) {
        /* calculate current average */
        /* which is actually the value for today */
        var data = db.root.data.arrHabit[idxHabit].arrData.find( function(data) {
                return isDateMatching(data.date, moment());
            } );
        if( data != undefined ) {
            curavg = data.value;
        }
        
        /* calculate old average, which is actually the reference data */
        arrDataRef.forEach( function(data) {
            oldavg += data.value;
        } );
        oldavg /= maxDataRef;
    }
    
    /* data available for longer days */
    else {
        /* calculate current average, which is the average of today's data
         * and reference data 
         */
        data = db.root.data.arrHabit[idxHabit].arrData.find( function(data) {
                return isDateMatching(data.date, moment());
            } );
        if( data != undefined ) {
            curavg = data.value;
        }
        arrDataRef.forEach( function(data) {
            curavg += data.value;
        } );
        curavg /= (maxDataRef+1);
        
        /* calculate old average, which is beyond the reference data */
        /* calculation is starting at maxDataRef and not maxDataRef+1,
         * otherwise there is a glitch in traffic light when there is
         * transition from few days data to longer days.
         */
        var sumMax = 0;
        var cntMax = 0;
        for (var offset = maxDataRef; offset < MAX_HISTORY_DATA; offset++) { 
            var data = db.getData(idHabit, moment().subtract(offset, "days"));
            if (data != undefined) {
                sumMax += parseInt(data.value);
                cntMax++;
            }
        }
        if (cntMax > 0) {
            oldavg = sumMax / cntMax;
        }
    }
    
    /* decide the color based on old and new average */
    var color = "transparent";
    var hi = oldavg + 0.1 * oldavg;
    var lo = oldavg - 0.1 * oldavg;
    switch (db.root.data.arrHabit[idxHabit].target.name) {
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

        case "Maintain":
            /* special case, override the current average */
            /* which is the average of today's data and reference data */
            data = db.root.data.arrHabit[idxHabit].arrData.find( function(data) {
                return isDateMatching(data.date, moment());
            } );
            if( data != undefined ) {
                curavg = data.value;
            }
            arrDataRef.forEach( function(data) {
                curavg += data.value;
            } );
            curavg /= (maxDataRef+1);
            
            /* calculate the goal */
            var goal = db.root.data.arrHabit[idxHabit].target.data1 / db.root.data.arrHabit[idxHabit].target.data2;
            var higreen = goal + 0.1*goal;
            var logreen = goal - 0.1*goal;
            var hiyellow = goal + 0.25*goal;
            var loyellow = goal - 0.25*goal;

            /* select color based on the type of "maintain" */
            switch( db.root.data.arrHabit[idxHabit].target.data3 ) {
                case "exact":
                    if(curavg >= logreen && curavg <= higreen)
                        color = COLOR_TARGET_GREEN;
                    else if(curavg > loyellow && curavg < hiyellow) 
                        color = COLOR_TARGET_YELLOW
                    else 
                        color = COLOR_TARGET_RED;
                    break;
                    
                case "more":
                    if( curavg > goal )
                        color = COLOR_TARGET_GREEN;
                    else if( curavg <= goal && curavg > loyellow )
                        color = COLOR_TARGET_YELLOW;
                    else if( curavg <= loyellow )
                        color = COLOR_TARGET_RED;
                    break;
                    
                case "less":
                    if( curavg < goal )
                        color = COLOR_TARGET_GREEN;
                    else if( curavg >= goal && curavg < hiyellow )
                        color = COLOR_TARGET_YELLOW;
                    else if( curavg >= hiyellow )
                        color = COLOR_TARGET_RED;
                    break;
            }
            break;
            
        default:
            alert( "Invalid case when showing traffic light" );
    }

    document.getElementById("light_" + idHabit).style.color = color;
}


/* do not change the order of setStyle() */
function setStyle() {
    "use strict";
    
    /* title bar settings */
    document.title = APP_NAME;
    document.getElementById("titleWindow").innerText = APP_NAME;

    /* button styling */
    var style = document.createElement( "style" );
    document.head.appendChild( style );
    style.innerText = ".mybutton:active { background-color: " + 
        getThemeColor("w3-theme-l3") + "; }";
		
    /* move the elements below header */
    document.getElementById("divBody").style.top =
        document.getElementById("divHeader").clientHeight + "px";

    /* set z-index of all elements */
    document.getElementById("divHeader").style.zIndex = Z_INDEX_MED;
    $(".w3-modal").css("z-index", Z_INDEX_TOP);
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
        
        /* empty cells for the habit row */
        for (var j = 2; j < numCol; j++) {
            row.insertCell(-1);
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
            arrData.push(db.getData(idHabit, date));
            cell.onclick = onclickEditData;
            cell.classList.add("mybutton");
            cell.style.border = "1px solid";
            cell.height = HEIGHT_DATA_CELL;
            cell.width = WIDTH_DATA_CELL;
        }

        /* calculate the max value */
        var max = Math.max(...(arrData.map(function (data) {
            return (data ? data.value : 0);
        })));

        /* fill the chart */
        for (var j = 0; j < numCol; j++) {
            var date = moment().subtract(numCol - (j + 1), "days");
            var data = db.getData(idHabit, date);
            cell = document.getElementById("datacell_" + idHabit + "_" + 
                                           date.format("YYMMDD"));

            switch( db.root.data.arrHabit[idxHabit].type ) {
                case "value":
                    /* if no data present, fill the cell with gray */
                    if (!data) {
                        createBar( cell, HEIGHT_DATA_CELL, COLOR_GRAY );
                    }
                    /* for normal data, create a proportionate chart */
                    else if(data.value > 0) {
                        var height = (data.value / max) * HEIGHT_DATA_CELL;
                        createBar( cell, height, getThemeColor("w3-theme") );
                    }
                    else {
                        /* data value is 0, dont create any chart */
                    }
                    break;
                    
                case "checkbox":
                    /* if no data present, fill the cell with gray */
                    if (!data) {
                        createBar( cell, HEIGHT_DATA_CELL, COLOR_GRAY );
                    }
                    else {
                        if( data.value == 0 )
                            createCheckbox( cell, false );
                        else
                            createCheckbox( cell, true );
                    }
                    break;
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



