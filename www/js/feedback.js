var msg = new Object();

function main() {
    ConfigLoad();
}

function onsubmitFeedback() {
    /* set the user name */
    if(config.name == "") 
        msg.name = "Anonymous";
    else
        msg.name = config.name;
    
    /* set email */
    if(config.email == "") 
        msg.email = "Anonym@ous.com";
    else
        msg.email = config.email;
    
    /* set the message */
    msg.message = document.getElementById("textMessage").value;
    
    sendFeedback();
//    window.history.back();
}

function sendFeedback() {
    if (navigator.onLine) { // check for internet connection
        $.get("https://api.myjson.com/bins/" + JSONID_FEEDBACK, function sendFeedback_step3(data, status, xhr) { // receive previous data
            var msglist = data.list;
            msglist.push(msg);
        });
    }
}
