function DialogSimpleShow(str)
{
    document.getElementById("divDialog").innerText = str;
    document.getElementById("divDialog").style.display = "block";
}

function DialogSimpleHide()
{
    document.getElementById("divDialog").style.display = "none";
}
