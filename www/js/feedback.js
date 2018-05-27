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
    
    sendFeedback_step1();
    window.history.back();
}

/* step1: check internet */
function sendFeedback_step1() {
    if (navigator.onLine) sendFeedback_step2();
}

/* step2: get previous data */
function sendFeedback_step2() {
    $.get("https://api.myjson.com/bins/" + JSONID_FEEDBACK);
}