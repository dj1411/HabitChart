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

function Entry(idEntry, date, value) {
    this.date = date;
    this.value = value;
    this.isValid = true;

    /* inheriting the signature elements */
    this.id = idEntry;
    this.timestamp = moment();
    this.isDeleted = false;
}

function Habit(idHabit, name, type, target) {
    this.name = name;
    this.type = type; //  options are chart, checkbox and count
    this.target = target; // options are improve, reduce and maintain
    
    this.arrEntry = new Array();
    
    /* inheriting the signature elements */
    this.id = idHabit;
    this.timestamp = moment();
    this.isDeleted = false;
}

function Data() {
    this.arrHabit = new Array();
}

function Config() {
}

/* root object */
function DB() {
    this.root = new Object();
    this.load();
    
    if(this.root.data == undefined || this.root.data == null || this.root.data === "") {
        this.root.data = new Data();
        this.save();
    }

    if(this.root.config == undefined || this.root.config == null || this.root.config === "") {
        this.root.config = new Config();
        this.save();
    }
}

/* load the database from local storage */
/* do not reorder this function */
DB.prototype.load = function () {
    var d = localStorage.getItem("dbHabitChart");
    if (d != null && d != undefined && d !== "") {
        this.root = JSON.parse(d);
    }
}

/* save the database to local storage */
/* do not reorder this function */
DB.prototype.save = function () {
    localStorage.setItem("dbHabitChart", JSON.stringify(this.root));
}

DB.prototype.addHabit = function (name, type, target) {
    /* find an unique habit id */
    var idHabit = 0;
    while( ! this.root.data.arrHabit.every( function(habit) {
        return (habit.id != idHabit);
    } ) ) {
        idHabit++;
    }
    
    /* create a habit object and append to the habit array */
    var habit = new Habit(idHabit, name, type, target);
    this.root.data.arrHabit.push(habit);
    
    this.save();
}

DB.prototype.removeHabit = function(idHabit) {
    var idxHabit = this.root.data.arrHabit.findIndex( function(habit)  {
        return (habit.id == idHabit);
    } );

    this.root.data.arrHabit.splice(idxHabit, 1);
    
    this.save();
}

DB.prototype.editHabit = function (idHabit, name, type, target) {
    /* find habit idx */
    var idxHabit = this.root.data.arrHabit.findIndex( function(habit)  {
        return (habit.id == idHabit);
    } );
    
    /* update */
    this.root.data.arrHabit[idxHabit].name = name;
    this.root.data.arrHabit[idxHabit].type = type;
    this.root.data.arrHabit[idxHabit].target = target;
    
    this.save();
}

DB.prototype.addEntry = function (idHabit, date, value) {
    /* find habit idx */
    var idxHabit = this.root.data.arrHabit.findIndex( function(habit)  {
        return (habit.id == idHabit);
    } );
    
    /* find an unique entry id */
    var idEntry = 0;
    while( ! this.root.data.arrHabit[idxHabit].arrEntry.every( function(entry) {
        return (entry.id != idEntry);
    } ) ) {
        idEntry++;
    }
    
    /* create an entry and add to the habit */
    var entry = new Entry(idEntry, date, value);
    this.root.data.arrHabit[idxHabit].arrEntry.push(entry);
    
    this.save();
}

DB.prototype.removeEntry = function (idHabit, idEntry) {
    /* find habit idx */
    var idxHabit = this.root.data.arrHabit.findIndex( function(habit)  {
        return (habit.id == idHabit);
    } );
    
    /* find entry idx */
    var idxEntry = this.root.data.arrHabit[idxHabit].arrEntry.findIndex( function(entry)  {
        return (entry.id == idEntry);
    } );    
    
    this.root.data.arrHabit[idxHabit].arrEntry.splice( idxEntry, 1 );
    
    this.save();
}

DB.prototype.updateEntry = function (idHabit, idEntry, date, value) {
    /* find habit idx */
    var idxHabit = this.root.data.arrHabit.findIndex( function(habit)  {
        return (habit.id == idHabit);
    } );
    
    /* find entry idx */
    var idxEntry = this.root.data.arrHabit[idxHabit].arrEntry.findIndex( function(entry)  {
        return (entry.id == idEntry);
    } );   
    
    this.root.data.arrHabit[idxHabit].arrEntry[idxEntry].date = date;
    this.root.data.arrHabit[idxHabit].arrEntry[idxEntry].value = value;
    
    this.save();
}