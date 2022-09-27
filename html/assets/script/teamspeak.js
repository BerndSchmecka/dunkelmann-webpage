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

let STABLE_URL = "aHR0cHM6Ly90ZWFtc3BlYWsuY29tL2VuL2Rvd25sb2Fkcy8jY2xpZW50";
let SERVER_URL = "aHR0cHM6Ly90ZWFtc3BlYWsuY29tL2VuL2Rvd25sb2Fkcy8jc2VydmVy";
let BETA_URL = "";
let ALPHA_URL = "";

let TS5_URL = "aHR0cHM6Ly93d3cudGVhbXNwZWFrLmNvbS9kZS9kb3dubG9hZHMvI3RzNQ==";

requestJSON = function(version, endpoint, callback){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(request.readyState === 4 && request.status === 200){
            var obj = JSON.parse(request.responseText);
            if(version === 3){
                var date = obj.headers["Last-Modified"][0];
                var lastModified = Math.floor(Date.parse(date) / 1000);
                callback(obj.body, lastModified);
            } else if (version === 5){
                var date = obj.versionInfo[0].headers["Last-Modified"][0];
                var lastModified = Math.floor(Date.parse(date) / 1000);
                callback(obj, lastModified);
            }
        }
    }
    request.open("GET", endpoint);
    request.send();
}

Vue.component('lm-annotation', {
    props: ['lm'],
    template: `<span class="annotation">Zuletzt geändert am: <abbr :title="lm.unix">{{ lm.text }}</abbr></span>`
});

var app = new Vue({
    el: '#teamspeakApp',
    data: {
        ts3channels: [],
        ts5channels: [],
        ts3lastModified: {
            key: 0,
            unix: 0,
            text: ""
        },
        ts5lastModified: {
            key: 1,
            unix: 0,
            text: ""
        },
        isLoading3: true,
        isLoading5: true
    },
    created: function () {
        this.request();
    },
    methods: {
        request: function() {
            requestJSON(3, window.GLOBAL_ENV.TEAMSPEAK3_ENDPOINT, this.pushAll3Elements)
            requestJSON(5, window.GLOBAL_ENV.TEAMSPEAK5_ENDPOINT, this.pushAll5Elements)
        },
        pushAll3Elements: function(obj, lastModified){
            this.ts3lastModified.unix = lastModified
            this.ts3lastModified.text = parseUnixTime(lastModified)
            obj.versions.forEach((element) => {
                this.push3Element(element);
            })
            this.isLoading3 = false;
        },
        push3Element: function(element) {
            app.ts3channels.push({
                channel: element.channel[0].toUpperCase()+element.channel.substring(1),
                version: element.version,
                timestamp: element.timestamp,
                time: parseUnixTime(element.timestamp),
                download: getDownloadButton(element.channel)
            });
        },
        pushAll5Elements: function(obj, lastModified){
            this.ts5lastModified.unix = lastModified
            this.ts5lastModified.text = parseUnixTime(lastModified)
            obj.versionInfo.forEach((element) => {
                this.push5Element(element);
            })
            this.isLoading5 = false;
        },
        push5Element: function(element) {
            app.ts5channels.push({
                channel: element.platformName[0].toUpperCase()+element.platformName.substring(1),
                version: element.platformInfo.version+'-'+element.platformInfo.version_string,
                timestamp: element.platformInfo.timestamp,
                time: parseUnixTime(element.platformInfo.timestamp),
                download: {
                    class: 'btn btn-primary',
                    onclick: 'window.open(decodeBase64(TS5_URL), \'_blank\').focus();'
                }
            });
        }
    }
});

var video = new Vue({
    el: '#vid',
    data: {
        poster: ''
    }
});

jebaited=function(){
    video.$el.play();

    var el = document.querySelectorAll("div,table,p,code,tr,td,th");
    for(var i=0;i<el.length;i++){
el[i].className += " special";
}

    var all = document.querySelectorAll(".bg-primary,.accordion-button,.btn-primary,.btn-danger");
for (var i = 0; i < all.length; i++) {
all[i].style.setProperty("background-image", "url(assets/special/rainbow.gif)", "important");
}
}

getDownloadButton=function(f){
    if(f.toLowerCase() == "beta"){
        return {
            class: 'btn btn-primary',
            toggle: 'modal',
            target: '#modalBeta'
        }
    } else if (f.toLowerCase() == "alpha"){
        return {
            class: 'btn btn-danger cursor-not-allowed',
            onclick: 'jebaited();'
        }
    } else {
        return {
            class: 'btn btn-primary',
            onclick: 'window.open(decodeBase64(' + f.toUpperCase() + '_URL), \'_blank\').focus();'
        }
    }
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    video.poster = "assets/thumbnails/gray.png";
} else {
    video.poster = "assets/thumbnails/white.png";
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? "dark" : "light";
    if(newColorScheme === "dark"){
        video.poster = "assets/thumbnails/gray.png";
    } else {
        video.poster = "assets/thumbnails/white.png";
    }
});