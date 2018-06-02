function setStyleIndex()
{
    /* set the app name and version */
    document.title = APP_NAME;
    document.getElementById("title").innerText = APP_NAME;
    document.getElementById("labelTitleAbout").innerText = APP_NAME;
    document.getElementById("labelVersionAbout").innerText = "v" + APP_VER;
    
    /* sidebar header */
    if(config.name != "") document.getElementById("labelName").innerText = config.name;
    if(config.email != "") document.getElementById("labelEmail").innerText = config.email;
    
    /* hide the selection toolbar */
    $(".divToolbarSelection").css("display", "none");
    
    /* hide sync button for other users */
    if(SYNC_ENABLE == false)
        document.getElementById("buttonSync").classList.add("w3-hide");
    
    /* hide the modals */
    var modal1 = document.getElementById("modalAddHabit");
    var modal2 = document.getElementById("modalEditData");
    var modal3 = document.getElementById("modalAbout");
    window.onclick = function(event) {
        if (event.target == modal1 
            || event.target == modal2
            || event.target == modal3
           ) {
            modal1.style.display = "none";
            modal2.style.display = "none";
            modal3.style.display = "none";
        }
    }
}
