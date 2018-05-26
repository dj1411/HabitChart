var config = new Object();

function main() {
    prefillValues();
}

function prefillValues() {
    /* load from local storage */
    var str = localStorage.getItem("config");
    if(str == null)
        setInitValues();
    else
        config = JSON.parse(str);

    /* prefill the form */
    document.getElementById("textName").value = config.name;
    document.getElementById("textEmail").value = config.email;
    document.getElementById("checkSyncEnable").checked = config.syncEnable;
    document.getElementById("textSyncInterval").value = config.syncInterval;
}

function onclickSave() {
    /* set the config data from form */
    config.name = document.getElementById("textName").value;
    config.email = document.getElementById("textEmail").value;
    config.syncEnable = document.getElementById("checkSyncEnable").checked;
    config.syncInterval = document.getElementById("textSyncInterval").value;
    
    /* save to local storage */
    localStorage.setItem("config", JSON.stringify(config));
    
    /* finally go the previous page */
    window.history.back();
}

function setInitValues() {
    config.name = "";
    config.email = "";
    config.syncEnable = false;
    config.syncInterval = SYNC_INTERVAL_S;
}
