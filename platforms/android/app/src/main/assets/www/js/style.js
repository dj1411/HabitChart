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

function setStyleIndex()
{
    /* set the app name and version */
    document.title = APP_NAME;
    document.getElementById("title").innerText = APP_NAME;
    document.getElementById("labelTitleAbout").innerText = APP_NAME;
    document.getElementById("labelVersionAbout").innerText = "v" + APP_VER;
    
    /* sidebar header */
    if(config.name != "") document.getElementById("labelName").innerText = config.name;
    if(config.email != "") document.getElementById("labelEmail").innerText = config.email;
    
    /* hide the selection toolbar */
    $(".divToolbarSelection").css("display", "none");
    
    /* hide sync button for other users */
    if(SYNC_ENABLE == false)
        document.getElementById("buttonSync").classList.add("w3-hide");
    
    /* set size of input text fields */
    document.getElementById("textHabit").maxLength = WIDTH_HABIT_COL / (15/2); // 15 = w3.css default font size in px
    
    /* disable exit button for browser */
    if(navigator.userAgent.indexOf("Android") == -1) {         
        document.getElementById("buttonExit").classList.add("w3-disabled");
    }

    
    /* hide the modals */
    var modal1 = document.getElementById("modalAddHabit");
    var modal2 = document.getElementById("modalEditData");
    var modal3 = document.getElementById("modalAbout");
    var modal4 = document.getElementById("modalStat");
    var modal5 = document.getElementById("modalHelp");
    window.onclick = function(event) {
        if (event.target == modal1 
            || event.target == modal2
            || event.target == modal3
            || event.target == modal4
            || event.target == modal5
           ) {
            modal1.style.display = "none";
            modal2.style.display = "none";
            modal3.style.display = "none";
            modal4.style.display = "none";
            modal5.style.display = "none";
        }
    }
}
