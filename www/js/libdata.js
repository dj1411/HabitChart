/* Default data upon reset */
var data;
var dataCloud;
var dataInit = {
    "DataFormatVer": 3,
    "MyJsonID": ACTIVE_JSON_ID,
    "UserID": "test",
    "Timestamp": "01/01/2000",
    "CurrentID": "",
    "HabitList": [],
    "TargetList": [],
    "Custom": "",
    "DataList": {
    }
};

var selectedHabit = "";

/*  this function validates the data passed as pamaeter.
    return true: validation success
    return false: validation failed
*/
function DataValidate(d)
{
    /* check for empty data */
    if (d === null || d === undefined)
        return false;

    /* parse for further validations */
    d = JSON.parse(d);

    /* CurrentID should not be greater than current date */
    var dd = new Date();
    if (d.CurrentID.split("_")[0] > dd.getDate())
        return false;

    /* mandatory fields should not be blank */
    if (d.DataFormatVer == "" || d.DataFormatVer == null || d.DataFormatVer == undefined)
        return false;
    if (d.UserID == "" || d.UserID == null || d.UserID == undefined)
        return false;
    if (d.Timestamp == "" || d.Timestamp == null || d.Timestamp == undefined)
        return false;

    /* validation of the DataList */
    var prevEntry = 0;
    var keyCurrentID = false;
    for (var key in d.DataList)
    {
        /* There should be a key corresponding the current id */
        if (key == ("Date_" + d.CurrentID))
            keyCurrentID = true;

        /* Each item in DataList should have the same length as HabitList */
        if (d.DataList[key].length !== d.HabitList.length)
            return false;

        /* DataList entries should be contiguous */
        if ((prevEntry != 0) && parseInt(key.split("_")[1]) != (prevEntry + 1))
            return false;
        else
            prevEntry = parseInt(key.split("_")[1]);
    }
    if (keyCurrentID == false)
        return false;
    
    /* checks for data format version 3 */
    if(d.DataFormatVer == 3) {
        for(var i=0; i<d.HabitList.length; i++) {
            /* check if habit is empty */
            if(d.HabitList[i].Name == null || d.HabitList[i].Name == undefined || d.HabitList[i].Name == "") return false;
            
            /* check if target is empty */
            if(d.HabitList[i].Target == null || d.HabitList[i].Target == undefined || d.HabitList[i].Target == "") return false;
            
            /* check if target is either Improve, Reduce or Reach */
            if(d.HabitList[i].Target != "Improve" && d.HabitList[i].Target != "Reduce"
                && d.HabitList[i].Target.slice(0,5) != "Reach") {
                return false;
            }
        }
    }
    
    return true;
}

function DataCheckInternet()
{
    if (navigator.onLine)
        DataRefresh(1);     /* connection successful. continue with sync */
    else
        DataRefresh(3);    /* No internet connection. just update the table */
}

function DataSaveCloud() {
    if (data.MyJsonID == "")    /* First time storing data to cloud */
    {
        $.get("https://api.myjson.com/bins/" + ACTIVE_JSON_ID, function (result, textStatus, xhdr) {
            DataSetMyJsonID(result[data.UserID]);
        });
    }
    else
    {
        $.ajax({
            url: "https://api.myjson.com/bins/" + data.MyJsonID,
            type: "PUT",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result, status, xhdr) {
                DataRefresh(3);
            },
            error: function (xhdr, status, msg) {
                alert("There was an error saving data to cloud: " + msg);
            }
        }); 
    }
}

/* This function should only by called during cloud sync */
function DataLoadCloud() 
{
    /* It is assumed that RAM data is valid by now. */

    /*  First time accessing cloud data, get the id and then retrieve the data. */
    if (data.MyJsonID == "")
    {
        $.get("https://api.myjson.com/bins/" + ACTIVE_JSON_ID, function (result, textStatus, xhdr)
        {
            DataSetMyJsonID(result[data.UserID]);
            $.get("https://api.myjson.com/bins/" + data.MyJsonID, ReadCloudData);
        });
    }
    else /* Otherwise simply retrieve the data */
    {
        $.get("https://api.myjson.com/bins/" + data.MyJsonID, ReadCloudData);
    }

    function ReadCloudData(result, textStatus, xhdr)
    {
        if (result.DataFormatVer == undefined)
        {
            /* if cloud data is empty, put init values */
            dataCloud = dataInit; 

            /*  It is expected that the rest of the sync process will write the local data to cloud.
                So henceforth, cloud data will no longer be empty.
            */
        }
        else
        {
            /* put the actual cloud data for rest of the sync process */
            dataCloud = result;
        }
        
        DataRefresh(2);
    }
}

/*  This function will be called once at the begining of the app.
    In other words, every time index.html is loaded.
    An then it is perodically called.

    Description:
    - sync data with cloud.
        * The older data will be overwritten with the newer data.
        * Sync happens between RAM data and cloud data.
        * RAM data should always be written using the set APIs. In the set API its written back to localStorage.
    - refresh the local data, bring it up to current date
    - then update the table
*/
function DataRefresh(step)
{
    switch (step)
    {
        case 0:     /* check internet */
            DataCheckInternet();
            break;

        case 1:     /* sync start */
            document.getElementById("divDialog").style.display = "block";
            DataLoadCloud();
            break;

        case 2:     /* data received from cloud */
            var dateLocal = new Date(data.Timestamp);
            var dateCloud = new Date(dataCloud.Timestamp);

            if (dateLocal < dateCloud)
            {
                /* copy cloud data to local */
                data = dataCloud;
                DataSave(false);

                /* continue with next step directly */
            }
            else if (dateLocal >= dateCloud)
            {
                DataSaveCloud();
                break;
            }

        case 3:     /* local data synced with cloud */
            /* If there is update in the Data format version */
            DataFormatConversion();

            /* bring data up to date */
            var dateCur = moment();
            var datePrev = moment( data.CurrentID.split("_")[0] + "/" + data.CurrentID.split("_")[1] + "/2018" , "DD/MM/YYYY" ); // todo fix year
            for( var date = datePrev.add(1, "day"); date.isBefore(dateCur); date = date.add(1, "day") )
            {
                var d = new Date(date.format());
                DataSetCurrentID(d);

                var arr = new Array();
                for (var i = 0; i < data.HabitList.length; i++)
                     arr.push(0);
                DataAdd(d, arr);
            }

            /* finish up */
            refreshTable();
            document.getElementById("divDialog").style.display = "none";;
            break;

        default:
            alert("invalid sync step");
    }
}

/*  this function will set the timestamp and copy RAM data to localStorage.
    Any data write operation should call this function.
    Otherwise, there will be inconsistent data.
    Timestamp should be updated only when there is change in actual data.
*/
function DataSave(flgUpdateTimestamp)
{
    if (flgUpdateTimestamp == true)
        data.Timestamp = new Date();

    localStorage.setItem("data", JSON.stringify(data));

    /* cant do cloud sync here because thats an async operation */

    /* other data which dont need cloud sync */
    localStorage.setItem("selectedHabit", selectedHabit);
}

/*  Data loaded from localStorage to RAM.
    This needs to be done whenever a new page is loaded, because RAM is local to the page.
    It is not necessary to repeatedly do this, because localStorage is always updated when RAM data is written throug the APIs.
*/
function DataLoad()
{
    /* Load the main data */
    var d = localStorage.getItem("data");
    if (DataValidate(d))
    {
        data = JSON.parse(d);
    }
    else
    {
        data = dataInit;
        DataSave(false);
    }

    /* other data which dont need cloud sync */
    d = localStorage.getItem("selectedHabit");
    if (d !== null && d !== undefined)
        selectedHabit = d;
    else
        selectedHabit = "";
}

/* before calling this function, make sure RAM data is valid */
function DataReset(ramData, localData, cloudData)
{
    if (ramData)
        data = {};

    if (localData)
        localStorage.clear();

    if (cloudData)
    {
        $.ajax({
            url: "https://api.myjson.com/bins/" + dataInit.MyJsonID,
            type: "PUT",
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result, status, xhdr)
            {
                alert("Cloud data is cleared");
            },
            error: function (xhdr, status, msg)
            {
                alert("Cloud data could not be cleared: " + msg);
            }
        });
    }
}

function DataHabitAdd(habit)
{
    /* check if habit already exists */
    for(var i=0; i<data.HabitList.length; i++) {
        if(habit.Name == data.HabitList[i].Name) {
            alert("Habit already exists");
            return;
        }
    }
    
    /* Update HabitList */
    data.HabitList.push(habit);

    /* Update DataList */
    if (data.CurrentID !== "") /* Check for first time usage */
    {
        for (var key in data.DataList)
            data.DataList[key].push(0);
    }
    else
    {
        /* First time */
        DataSetCurrentID(new Date());
        DataAdd(new Date(), [0]);
    }

    DataSave(true);
}

function DataHabitRemove(habit)
{
    /* Update HabitList */
    var id = -1;
    data.HabitList = data.HabitList.filter(
        function( element, index, array )
        {
            if (element.Name === habit)
            {
                id = index;
                return false;
            }
            else
                return true;
        }
    );

    /* Update DataList */
    if (id !== -1)
    {
        for (var key in data.DataList)
        {
            data.DataList[key] = data.DataList[key].filter(
                function (element, index, array) {
                    return id !== index;
                }
            );
        }
    }

    DataSave(true);
}

function DataHabitUpdate(oldHabit, newHabit)
{
    /* validations */
    if (oldHabit.Name == "" || newHabit.Name == "") return;
    if (oldHabit.Name == newHabit.Name && oldHabit.Target == newHabit.Target) return;

    for(var i=0; i<data.HabitList.length; i++) {
        if(data.HabitList[i].Name == oldHabit) data.HabitList[i] = newHabit;
    }

    DataSave(true);
}

function DataAdd(date,arr)
{
    flgError = false;

    if (arr.length !== data.HabitList.length)
        flgError = true;

    var d = "Date_" + date.getDate() + "_" + (date.getMonth()+1);
    data.DataList[d] = arr;

    if (flgError)
        alert("Error Adding data");
    else
        DataSave(true);
}

function DataSetCurrentID(date)
{
    data.CurrentID = date.getDate() + "_" + (date.getMonth() + 1);
    DataSave(true);
}

function DataSetMyJsonID(id) {
    data.MyJsonID = id;
    DataSave(false); /* todo if timestamp is set here, cloud data will not be loaded. on the other hand, JsonID will never be written to cloud/localStorage. */
}

function DataListSize()
{
    var size = 0;
    for (var key in data.DataList)
        size++;
    return size;
}

function DataGetByDate(date)
{
    var k = "Date_" + date.getDate() + "_" + (date.getMonth()+1);
    for (var key in data.DataList)
        if (k === key)
            return data.DataList[key];
}

function DataGetByRC(r, c) {
    var mom = moment();
    var date = mom.subtract(c, "day").toDate();
    var arr = DataGetByDate(date);
    return arr[r];
}

function DataSetByDate(date, arr) {
    var k = "Date_" + date.getDate() + "_" + (date.getMonth() + 1);
    for (var key in data.DataList)
        if (k === key)
            data.DataList[key] = arr;
    DataSave(true);
}

function DataGetByRow(row)
{
    var arr = new Array();
    for (var key in data.DataList) {
        arr.push(data.DataList[key][row]);
    }
    return arr.reverse();
}

function DataFormatConversion()
{
    /*  By now RAM data, local storage and cloud data are in sync and is valid.
        Assuming no other operation on the data is started yet.
    */
    
    /* converting from ver 2 to 3 */
    if (data.DataFormatVer == 2 && dataInit.DataFormatVer == 3)
    {
        var oldHabitList = data.HabitList;
        var newHabitList = new Array();
        for(var i=0; i<oldHabitList.length; i++) {
            var obj = new Object();
            obj.Name = oldHabitList[i];
            obj.Target = "Improve";
            newHabitList.push(obj);
        }
        data.HabitList = newHabitList;
        data.DataFormatVer = 3;
        DataSave(true);
        location.reload();
    }
}

function DataSelectedHabitReset()
{
    selectedHabit = "";
    DataSave(false);
}

function DataSelectedHabitUpdate(habitId)
{
    if (habitId == "")
        selectedHabit = "";
    else
        selectedHabit = document.getElementById(habitId).innerText;

    DataSave(false);
}

function DataSelectedHabitGetId()
{
    var arr = document.getElementsByClassName("habitColumn");

    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i].innerText == selectedHabit)
            return arr[i].id;
    }

    return null;
}

function DataSelectedHabitGetStr()
{
    return selectedHabit;
}
