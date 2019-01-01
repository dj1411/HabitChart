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

/* The main entry point. This function is entered when Cordova is ready. */
function main() {
    setStyle();
}

/* do not change the order of setStyle() */
function setStyle() {
    /* set the app name */
    document.title = APP_NAME;
    document.getElementById("titleWindow").innerText = APP_NAME;    
    
    /* move the main body below header */
    document.getElementById("divBody").style.top = document.getElementById("divHeader").clientHeight + "px";
}

function onclickAddEditHabit(event) {
    if(event.target == document.getElementById("buttonAdd") || 
       event.target.parentNode == document.getElementById("buttonAdd")
      ) {
        document.getElementById("titleAddEditHabit").innerText = "Add Habit";
    }

    document.getElementById("modalAddEditHabit").style.display = "block";
}

function onsubmitAddEditHabit() {
    document.getElementById("modalAddEditHabit").style.display = "none";
    
    db.addHabit( document.getElementById("textHabit").value,
                 document.getElementById("optionHabitType").value,
                 document.getElementById("optionTarget").value
               )
}