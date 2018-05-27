function main() {
    ConfigLoad();
}

function onsubmitFeedback() {
    var mes = new Object();
    
    /* set the user name */
    if(config.name == "") 
        mes.name = "Anonymous";
    else
        mes.name = config.name;
    
    /* set email */
    if(config.email == "") 
        mes.email = "Anonym@ous.com";
    else
        mes.email = config.email;
    
    /* set the message */
    mes.message = document.getElementById("textMessage").value;
    
    sendFeedback(mes);
    window.history.back();
}

function sendFeedback(mes) {
}