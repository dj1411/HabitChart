/*******************************************************************************
 * MIT License
 * 
 * Copyright (c) 2018 Jayanta Debnath
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *******************************************************************************/


function TargetType(name, data1, data2, data3) {
    "use strict";
    
    this.name = name;   // name of the target
    this.data1 = data1; // number of times
    this.data2 = data2; // in how many days
    this.data3 = data3; // exact, more or less
}


function DataEntry(idData, date, value) {
    "use strict";

    this.date = date;
    this.value = value;

    /* inheriting the signature elements */
    this.id = idData;
    this.timestamp = moment();
}


function Habit(idHabit, name, type, target) {
    "use strict";
    
    this.name = name;
    this.type = type; //  options are chart, checkbox and count
    this.target = target; // options are improve, reduce and maintain

    this.arrData = [];

    /* inheriting the signature elements */
    this.id = idHabit;
    this.timestamp = moment();
}


function Data() {
    "use strict";
    
    this.arrHabit = [];
}


function Config() {
    "use strict";
}


/* root object */
function DB() {
    "use strict";
    
    this.root = {};
    this.load();

    if (this.root.data === undefined || this.root.data === null || this.root.data === "") {
        this.root.data = new Data();
        this.save();
    }

    if (this.root.config === undefined || this.root.config === null || this.root.config === "") {
        this.root.config = new Config();
        this.save();
    }
}


/* save entire database to file */
DB.prototype.saveToFile = function () {
    "use strict";

    /* This feature is available in Android only */
    /* todo: in future extend to iOS also */
    if (navigator.userAgent.indexOf("Android") >= 0) {
        var content = new Blob([JSON.stringify(this.root)], {
            type: "text/json"
        });

        /* go to the directory */
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
            function (dirEntry) {
                /* open the file */
                dirEntry.getFile("database.json", {
                    create: true,
                    exclusive: false
                },
                    function (fileEntry) {

                        /* write contents to the file */
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.onerror = function (err) {
                                alert("error writing to file: " + err.toString());
                            };

                            fileWriter.write(content);
                        });

                    },
                    function () {
                        alert("Could not open file");
                    });
            },
            function () {
                alert("Could not open directory");
            });
    }
};


/* overwrite database with the contents of file */
DB.prototype.loadFromFile = function () {
    "use strict";

        /* This feature is available in Android only */
    /* todo: in future extend to iOS also */
    if (navigator.userAgent.indexOf("Android") >= 0) {

        /* go to the directory */
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
            function (dirEntry) {
                /* open the file */
                dirEntry.getFile("database.json", {
                    create: false,
                    exclusive: false
                },
                    function (fileEntry) {

                        /* read the file into a json object */
                        fileEntry.file(function (file) {
                            var reader = new FileReader();

                            reader.onerror = function (err) {
                                alert("error reading from file: " + err.toString());
                            };

                            reader.onloadend = function () {
                                /* I would have really liked to avoid using db. */
                                /* But could not find a way to write to 'this' with so
                                 * many nested anonymous callbacks */
                                db.root = JSON.parse(this.result);
                                db.save();
                            };

                            reader.readAsText(file);
                        });

                    },
                    function () {
                        alert("Could not open file");
                    });

            },
            function () {
                alert("Could not open directory");
            });
    }
};


/* load the database from local storage */
/* do not reorder this function */
DB.prototype.load = function () {
    "use strict";
    var d = localStorage.getItem( getStorName("db") );
    if (d !== null && d !== undefined && d !== "") {
        this.root = JSON.parse(d);
    }
};


/* save the database to local storage */
/* do not reorder this function */
DB.prototype.save = function () {
    "use strict";
    
    localStorage.setItem(getStorName("db"), JSON.stringify(this.root));
};


DB.prototype.addHabit = function (name, type, target) {
    "use strict";
    
    /* find an unique habit id */
    var idHabit = 0;
    while (!this.root.data.arrHabit.every(function (habit) {
            return (habit.id !== idHabit);
        })) {
        idHabit += 1;
    }

    /* create a habit object and append to the habit array */
    var habit = new Habit(idHabit, name, type, target);
    this.root.data.arrHabit.push(habit);

    this.save();
};


DB.prototype.removeHabit = function (idHabit) {
    "use strict";
    
    var idxHabit = getIdxHabit(idHabit);
    this.root.data.arrHabit.splice( idxHabit, 1 );
    this.save();
};


DB.prototype.editHabit = function (idHabit, name, type, target) {
    "use strict";
    /* find habit idx */
    var idxHabit = this.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id === idHabit);
    });

    /* update */
    this.root.data.arrHabit[idxHabit].name = name;
    this.root.data.arrHabit[idxHabit].type = type;
    this.root.data.arrHabit[idxHabit].target = target;

    this.save();
};


DB.prototype.getData = function (idHabit, date) {
    "use strict";
    
    var idxHabit = this.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id == idHabit);
    });

    return this.root.data.arrHabit[idxHabit].arrData.find(function (data) {
        return isDateMatching(moment(data.date), date);
    });    
}


DB.prototype.addData = function (idHabit, date, value) {
    "use strict";
    /* find habit idx */
    var idxHabit = this.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id === idHabit);
    });

    /* find an unique entry id */
    var idData = 0;
    while (!this.root.data.arrHabit[idxHabit].arrData.every(function (entry) {
            return (entry.id !== idData);
        })) {
        idData += 1;
    }

    /* create an entry and add to the habit */
    var entry = new DataEntry(idData, date, parseInt(value));
    this.root.data.arrHabit[idxHabit].arrData.push(entry);

    this.save();
};


DB.prototype.removeData = function (idHabit, idData) {
    "use strict";
    // set the deleted flag
};


DB.prototype.editData = function (idHabit, date, value) {
    "use strict";
    /* find habit idx */
    var idxHabit = this.root.data.arrHabit.findIndex(function (habit) {
        return (habit.id === idHabit);
    });

    /* find entry idx */
    var idxData = this.root.data.arrHabit[idxHabit].arrData.findIndex(function (entry) {
        return isDateMatching(entry.date, date);
    });

    this.root.data.arrHabit[idxHabit].arrData[idxData].date = date;
    this.root.data.arrHabit[idxHabit].arrData[idxData].value = parseInt(value);

    this.save();
};

