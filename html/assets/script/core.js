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

window.GLOBAL_ENV = {
    WS_API_ENDPOINT: 'wss://api-ws.dunkelmann.eu/v1',
    BADGE_ENDPOINT: "https://api.dunkelmann.eu/v2/getTeamSpeakBadges",
    BADGE_REVISIONS_ENDPOINT: "https://api.dunkelmann.eu/v2/getCachedBadgeRevisions",
    DISCOVERY_ENDPOINT: "https://api.dunkelmann.eu/v1/getTeamSpeakRoomDiscovery",
    TEAMSPEAK3_ENDPOINT: "https://api.dunkelmann.eu/v1/getTeamSpeakVersions/3",
    TEAMSPEAK5_ENDPOINT: "https://api.dunkelmann.eu/v1/getTeamSpeakVersions/5",
    AES_ENDPOINT: "https://api.dunkelmann.eu/v1/decryptAes",
    VERSIONLIST_ENDPOINT: "https://raw.githubusercontent.com/ReSpeak/tsdeclarations/master/Versions.csv",
}

decodeBase64=function(f){var g={},b=65,d=0,a,c=0,h,e="",k=String.fromCharCode,l=f.length;for(a="";91>b;)a+=k(b++);a+=a.toLowerCase()+"0123456789+/";for(b=0;64>b;b++)g[a.charAt(b)]=b;for(a=0;a<l;a++)for(b=g[f.charAt(a)],d=(d<<6)+b,c+=6;8<=c;)((h=d>>>(c-=8)&255)||a<l-2)&&(e+=k(h));return e};

parseUnixTime=function(t){
    var date = new Date(t * 1000);
    var curr_date = "0" + date.getDate();
    var curr_month = "0" + (date.getMonth() + 1); //Months are zero based
    var curr_year = date.getFullYear();
    var hours = "0" + date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = curr_date.substr(-2) + '.' + curr_month.substr(-2)  + '.' + curr_year + ' - ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

function webSocketLog(msg) {
    console.log('%c[Dunkelmann WebSocket] ' + `%c${msg}`, 'color: #871F78; font-weight: 900;', 'font-weight: 700;');
}

function webSocketLogDebug(msg) {
    console.debug('%c[Dunkelmann WebSocket] ' + `%c${msg}`, 'color: #006400; font-weight: 900;', 'font-weight: 700;');
}

function webSocketLogWarn(msg) {
    console.warn('%c[Dunkelmann WebSocket] ' + `%c${msg}`, 'color: #ff8c00; font-weight: 900;', 'font-weight: 700;');
}

// Returns an uint32 number from a base64 string (4 bytes)
function base64ToUint32(base64) {
    return new Uint32Array(decodeBase64(base64).split('').map(function (c) {
        return c.charCodeAt(0);
    }))[0];
}