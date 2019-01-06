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
    setStyle();
    showData();
}

/* do not change the order of setStyle() */
function setStyle() {
    /* set the app name */
    document.title = APP_NAME;
    document.getElementById("titleWindow").innerText = APP_NAME;    
    
    /* move the main body below header */
    document.getElementById("divBody").style.top = document.getElementById("divHeader").clientHeight + "px";
}

/* retrieve data of a habit for a given date */
function getEntry(idHabit, date) {
}

function onclickAddEditHabit(event) {
    if(event.target == document.getElementById("buttonAdd") || 
       event.target.parentNode == document.getElementById("buttonAdd")
      ) {
        document.getElementById("titleAddEditHabit").innerText = "Add Habit";
    }

    document.getElementById("modalAddEditHabit").style.display = "block";
}

function onclickEditData(event) {
    selectedCell = event.target.id;
    document.getElementById("modalEditData").style.display = "block";
}

function onsubmitAddEditHabit() {
    document.getElementById("modalAddEditHabit").style.display = "none";
    
    db.addHabit( document.getElementById("textHabit").value,
                 document.getElementById("optionHabitType").value,
                 document.getElementById("optionTarget").value
               )
}

function onsubmitEditData(event) {
    document.getElementById("modalEditData").style.display = "none";

    db.addData( selectedCell.split("_")[1],                     // habit
                moment(selectedCell.split("_")[2], "YYMMDD"),   // date
                document.getElementById("textData").value       // data
              );
    
    document.getElementById("textData").value = null;
    event.preventDefault(); // prevent page reload on submit
}

function showData() {
    /* clear the existing table */
    document.getElementById("tableData").innerText = "";
    
    /* calculate number of columns */
    var numCol = Math.floor( document.getElementById("tableData").clientWidth / WIDTH_DATA_CELL );
    
    /* get the table object */
    var table = document.getElementById("tableData");
    
    /* create the date row */
    var row = table.insertRow(0);
    row.classList.add("w3-tiny");
    for( var i=0; i<numCol; i++ ) {
        var cell = row.insertCell(i);
        cell.classList.add("w3-border-bottom");
        cell.innerHTML = moment().subtract(numCol - (i+1), "days").format("ddd<br>DD/MM");
    }
    
    /* create data rows */
    for(var i=0; i<db.root.data.arrHabit.length; i++) {
        /* habit name */
        row = table.insertRow(3*i+1);
        var cell = row.insertCell(0);
        cell.classList.add("w3-text-black");
        cell.style.maxWidth = 0;
        cell.style.whiteSpace = "nowrap";
        cell.innerHTML = "<i class='fas fa-circle'></i> ";
        cell.innerHTML += db.root.data.arrHabit[i].name;
        
        /* the chart */
        row = table.insertRow(3*i+2);
        for(var j=0; j<numCol; j++) {
            cell = row.insertCell(j);
            cell.id = "id_" + i + "_" + moment().subtract(numCol - (j+1), "days").format("YYMMDD");
            cell.style.borderBottom = HEIGHT_DATA_CELL + "px solid"; /* dummy values */
            cell.onclick = onclickEditData;
        }
        
        /* blank row for padding */
        row = table.insertRow(3*i+3);
        cell = row.insertCell(0);
        cell.innerHTML = "&nbsp;";
    }
}