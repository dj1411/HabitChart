function main() {
    if (navigator.onLine) { 
        $.get("https://api.myjson.com/bins/" + JSONID_FEEDBACK, function (data, status, xhr) {
            if(status == "success") {
                /* data was read successfully from server */
                
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