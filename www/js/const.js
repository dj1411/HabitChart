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

const APP_NAME = "Habit Chart";
const APP_VER = "1.0.0";

const DATA_FORMAT_VER = 4;

const SYNC_ENABLE = false;
const SYNC_INTERVAL_S = 300;
const MAX_HISTORY_DATA = 21;

const JSONID_MASTER = "mlerr";
const JSONID_TEST = "14gl63";
const JSONID_FEEDBACK = "15kbim";
const JSONID_ACTIVE = JSONID_TEST;    /* if you change this, you have to reset the local data */

const WIDTH_HABIT_COL = 200;
const WIDTH_DATA_COL = 40;
const WIDTH_SIGN = 20;
const HEIGHT_ROW = 50;
const HEIGHT_STAT_CHART = 100;

const COLOR_TARGET_GREEN = "#74d14c";
const COLOR_TARGET_YELLOW = "#ffe900";
const COLOR_TARGET_RED = "red";
