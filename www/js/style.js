function setStyleIndex()
{
    /* set the app name */
    document.title = APP_NAME;
    document.getElementById("title").innerText = APP_NAME;
    
    /* sidebar header */
    if(config.name != "") document.getElementById("labelName").innerText = config.name;
    if(config.email != "") document.getElementById("labelEmail").innerText = config.email;
    
    /* hide the selection toolbar */
    $(".divToolbarSelection").css("display", "none");
    
    /* hide the modals */
    var modal1 = document.getElementById("modalAddHabit");
    var modal2 = document.getElementById("modalEditData");
    window.onclick = function(event) {
        if (event.target == modal1 || event.target == modal2) {
            modal1.style.display = "none";
            modal2.style.display = "none";
        }
    }
}
