function setStyleCommon()
{
    /* set the app name */
    document.title = APP_NAME;
    document.getElementById("title").innerText = APP_NAME;
    
    /* Styles which depend on window size */
    var REF;
    if (window.innerHeight > window.innerWidth)
        REF = "vw";
    else
        REF = "vh";
}

function setStyleIndex()
{
    /* set the style common to all pages */
    setStyleCommon();

    /* hide the selection toolbar */
    $(".divToolbarSelection").css("display", "none");
    
    /* hide the add modal */
    var modal = document.getElementById('modalAddHabit');
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    /* Styles which depend on window size */
    var REF;
    if (window.innerHeight > window.innerWidth)
        REF = "vw";
    else
        REF = "vh";
}
