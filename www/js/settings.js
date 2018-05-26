var config = new Object();

function main() {
}

function onclickSave() {
    config.name = document.getElementById("textName").value;
    config.email = document.getElementById("textEmail").value;
    config.syncEnable = document.getElementById("checkSyncEnable").checked;
    config.syncInterval = document.getElementById("textSyncInterval").value;
    
    /* save to local storage */
    localStorage.setItem("config", JSON.stringify(config));
    
    /* finally go the previous page */
    window.history.back();
}