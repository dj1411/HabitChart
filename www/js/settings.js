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

var config = new Object();

function main() {
    ConfigLoad();
    prefillValues();
}

/* load from local storage */
function ConfigLoad() {
    var str = localStorage.getItem("config");
    if(str == null)
        setInitValues();
    else
        config = JSON.parse(str);
}

/* prefill the form */
function prefillValues() {
    document.getElementById("textName").value = config.name;
    document.getElementById("textEmail").value = config.email;
}

function onclickSave() {
    /* set the config data from form */
    config.name = document.getElementById("textName").value;
    config.email = document.getElementById("textEmail").value;
    
    /* save to local storage */
    localStorage.setItem("config", JSON.stringify(config));
    
    /* finally go the previous page */
    window.history.back();
}

function setInitValues() {
    config.name = "";
    config.email = "";
    localStorage.setItem("config", JSON.stringify(config));
}
