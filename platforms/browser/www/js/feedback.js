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
    ConfigLoad();
}

function onsubmitFeedback() {
    var msg = new Object();
    
    /* set the user name */
    if(document.getElementById("name").value != "") // todo this will be removed after `settings` is enabled
        msg.name = document.getElementById("name").value;
    else if(config.name == "") 
        msg.name = "Anonymous";
    else
        msg.name = config.name;
    
    /* set email */
    if(document.getElementById("email").value != "") // todo this will be removed after `settings` is enabled
        msg.email = document.getElementById("email").value;
    else if(config.email == "") 
        msg.email = "";
    else
        msg.email = config.email;
    
    /* set the message */
    msg.message = document.getElementById("textMessage").value;
    
    sendFeedback(msg);
}

function sendFeedback(msg) {
    if (navigator.onLine) { // check for internet connection
        $.get("https://api.myjson.com/bins/" + JSONID_FEEDBACK, function (data, status, xhr) { // receive previous data
            if(status == "success") {
                data.list.push(msg); // append the new message
                
                $.ajax({    // send data to server
                    url: "https://api.myjson.com/bins/" + JSONID_FEEDBACK,
                    type: "PUT",
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result, status, xhdr) {
                        alert("Feedback submitted successfully");
                        window.history.back();
                    },
                    error: function (xhdr, status, msg) {
                        alert("ERROR: Could not upload data");
                        window.history.back();
                    }
                }); 
            }
            else {
                alert("ERROR: Could not connect to server");
                window.history.back();
            }
        });
    }
    else {
        alert("ERROR: No internet connection");
        window.history.back();
    }
}
