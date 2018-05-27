var config = new Object();

function main() {
    ConfigLoad();
    prefillValues();
}

/* load from local storage */
function ConfigLoad() {
    var str = localStorage.getItem("config");
    if(str == null)
        setInitValues();
    else
        config = JSON.parse(str);
}

/* prefill the form */
function prefillValues() {
    document.getElementById("textName").value = config.name;
    document.getElementById("textEmail").value = config.email;
}

function onclickSave() {
    /* set the config data from form */
    config.name = document.getElementById("textName").value;
    config.email = document.getElementById("textEmail").value;
    
    /* save to local storage */
    localStorage.setItem("config", JSON.stringify(config));
    
    /* finally go the previous page */
    window.history.back();
}

function setInitValues() {
    config.name = "";
    config.email = "";
    localStorage.setItem("config", JSON.stringify(config));
}
