function setStyleCommon()
{
    /* set the app name */
    document.title = APP_NAME;
    document.getElementById("title").textContent = APP_NAME;
    
    /* Styles which depend on window size */
    var REF;
    if (window.innerHeight > window.innerWidth)
        REF = "vw";
    else
        REF = "vh";

    $("#divHeader").css("height", "10" + REF);
    $("#divHeader").css("line-height", "10" + REF);
    $("#divHeader").css("font-size", "5" + REF);

    $("body").css("background-color", color4);
    $("#divHeader").css("background-color", color1);
}

function setStyleIndex()
{
    /* set the style common to all pages */
    setStyleCommon();

    /* hide the selection toolbar */
    $(".divToolbarSelection").css("display", "none");
    
    /* color settings */
    $("#divAdd").css("background-color", color1);
    $("#divDialog").css("background-color", color4);
    
    /* Styles which depend on window size */
    var REF;
    if (window.innerHeight > window.innerWidth)
        REF = "vw";
    else
        REF = "vh";

    /* the (+) button */
    $("#divAdd").css("width", "13" + REF);
    $("#divAdd").css("height", "13" + REF);
    $("#divAdd").css("line-height", "13" + REF);

    /* colors for the menu */
    $("#divMenu").css("background-color", color4);
    var arrMenuItems = document.getElementsByClassName("divMenuItem"); /* for hover */
    for (var i = 0; i < arrMenuItems.length; i++)
    {
        arrMenuItems[i].onmouseover = function () { this.style.backgroundColor = color2; }
        arrMenuItems[i].onmouseleave = function () { this.style.backgroundColor = color4; }
    }
}

function setStyleAdd()
{
    /* set the style common to all pages */
    setStyleCommon();

    /* color settings */
    $(".divButton").css("background-color", color1);
}