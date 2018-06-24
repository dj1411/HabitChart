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

function main() {
    if (navigator.onLine) { 
        $.get("https://api.myjson.com/bins/" + JSONID_FEEDBACK, function (data, status, xhr) {
            if(status == "success") {
                /* data was read successfully from server */
                data.list.reverse();
                for(var i=0; i<data.list.length; i++) {
                    createMsgCard(data.list[i].name, data.list[i].email, data.list[i].message);
                }
            }
            else {
                createMsgCard("ERROR", "", "Could not connect to server");
            }
        });
    }
    else {
        createMsgCard("ERROR", "", "No internet connection");
    }
}

function createMsgCard(name, email, msg) {
    var divMsgList = document.getElementById("divMsgList");
    
    var divMsg = document.createElement("div");
    divMsgList.appendChild(divMsg);
    divMsg.setAttribute("id", "divMsg_2");
    divMsg.classList.add("w3-card");
    divMsg.classList.add("w3-margin-bottom");
    
    var header = document.createElement("header");
    divMsg.appendChild(header);
    header.classList.add("w3-bar");
    header.classList.add("w3-theme-l4");
    header.classList.add("w3-large");
    
    var nameElem = document.createElement("span");
    header.appendChild(nameElem);
    nameElem.classList.add("w3-bar-item");
    nameElem.innerText = name;
    
    var emailElem = document.createElement("a");
    header.appendChild(emailElem);
    emailElem.classList.add("w3-bar-item");
    emailElem.classList.add("w3-button");
    emailElem.classList.add("w3-right");
    emailElem.setAttribute("href", "mailto:" + email);
    emailElem.innerHTML = "<i class='fa fa-envelope'></i>";

    var msgElem = document.createElement("div");
    divMsg.appendChild(msgElem);
    msgElem.classList.add("w3-container");
    msgElem.innerText = msg;
}