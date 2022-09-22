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