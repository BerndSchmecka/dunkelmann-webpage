/*! *****************************************************************************
Copyright (c) Dunkelmann 2022. All rights reserved.

This code is licensed under the BSD License
You should have received a copy of the BSD License
with this code and it is also available through
the world-wide-web at <https://files.dunkelmann.eu/license.txt>.
If you did not receive a copy of the BSD License
and are unable to obtain it through the world-wide-web,
please send a note to <business@dunkelmann.eu> so we can mail you a copy
immediately.
***************************************************************************** */

let today = new Date();

// check whether current date is in october or the 1st of november
if (today.getMonth() === 9 || (today.getMonth() === 10 && today.getDate() === 1)) {
    // make elements with class "halloween" visible
    enableHalloween();
}

function getAdvent(year) {
    //in javascript months are zero-indexed. january is 0, december is 11
    var d = new Date(new Date(year, 11, 24, 0, 0, 0, 0).getTime() - 3 * 7 * 24 * 60 * 60 * 1000);
    while (d.getDay() != 0) {
      d = new Date(d.getTime() - 24 * 60 * 60 * 1000);
    }
  
    return d;
}

// check whether current date is after or on the first advent and before or on 30th of december
if (today >= getAdvent(today.getFullYear()) && today <= new Date(today.getFullYear(), 11, 30)) {
    // make elements with class "advent" visible
    enableAdvent();
}

function enableHalloween() {
    document.querySelectorAll(".halloween").forEach(function (el) {
        el.style.display = "block";
    }
    );
}

function disableHalloween() {
    document.querySelectorAll(".halloween").forEach(function (el) {
        el.style.display = "none";
    }
    );
}

function enableAdvent() {
    document.querySelectorAll(".advent").forEach(function (el) {
        el.style.display = "block";
    }
    );
}

function disableAdvent() {
    document.querySelectorAll(".advent").forEach(function (el) {
        el.style.display = "none";
    }
    );
}