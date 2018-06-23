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
