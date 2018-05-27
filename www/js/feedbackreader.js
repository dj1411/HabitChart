function main() {
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
    
    var name = document.createElement("span");
    header.appendChild(name);
    name.classList.add("w3-bar-item");
    name.innerText = "Jayanta";
    
    var email = document.createElement("a");
    header.appendChild(email);
    email.classList.add("w3-bar-item");
    email.classList.add("w3-button");
    email.classList.add("w3-right");
    email.setAttribute("href", "mailto:jayanta.dn@gmail.com");
    email.innerHTML = "<i class='fa fa-envelope'></i>";

    var msg = document.createElement("div");
    divMsg.appendChild(msg);
    msg.classList.add("w3-container");
    msg.innerText = "Message Message Message Message";
}