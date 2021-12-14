/*! *****************************************************************************
Copyright (c) Dunkelmann 2021. All rights reserved.

This code is licensed under the BSD License
You should have received a copy of the BSD License
with this code and it is also available through
the world-wide-web at <https://files.dunkelmann.eu/license.txt>.
If you did not receive a copy of the BSD License
and are unable to obtain it through the world-wide-web,
please send a note to <business@dunkelmann.eu> so we can mail you a copy
immediately.
***************************************************************************** */

let TS3_EP = "aHR0cHM6Ly9hcGkuZHVua2VsbWFubi5ldS90czN2ZXJzaW9u";
let TS5_EP = "aHR0cHM6Ly9hcGkuZHVua2VsbWFubi5ldS90czV2ZXJzaW9u";

let STABLE_URL = "aHR0cHM6Ly90ZWFtc3BlYWsuY29tL2VuL2Rvd25sb2Fkcy8jY2xpZW50";
let SERVER_URL = "aHR0cHM6Ly90ZWFtc3BlYWsuY29tL2VuL2Rvd25sb2Fkcy8jc2VydmVy";
let BETA_URL = "";
let ALPHA_URL = "";

let TS5_URL = "aHR0cHM6Ly93d3cudGVhbXNwZWFrLmNvbS9kZS9kb3dubG9hZHMvI3RzNQ==";
decodeBase64=function(f){var g={},b=65,d=0,a,c=0,h,e="",k=String.fromCharCode,l=f.length;for(a="";91>b;)a+=k(b++);a+=a.toLowerCase()+"0123456789+/";for(b=0;64>b;b++)g[a.charAt(b)]=b;for(a=0;a<l;a++)for(b=g[f.charAt(a)],d=(d<<6)+b,c+=6;8<=c;)((h=d>>>(c-=8)&255)||a<l-2)&&(e+=k(h));return e};

parseUnixTime=function(t){
    var date = new Date(t * 1000);
    var curr_date = "0" + date.getDate();
    var curr_month = "0" + (date.getMonth() + 1); //Months are zero based
    var curr_year = date.getFullYear();
    var hours = "0" + date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = curr_date.substr(-2) + '.' + curr_month.substr(-2)  + '.' + curr_year + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

requestJSON = function(encodedUrl, callback){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(request.readyState === 4 && request.status === 200){
            var obj = JSON.parse(request.responseText);
            callback(obj);
        }
    }
    request.open("GET", decodeBase64(encodedUrl));
    request.send();
}

var TS3Table = new Vue({
    el: '#ts3version',
    data: {
        channels: []
    },
    created: function () {
        this.request();
    },
    methods: {
        request: function() {
            requestJSON(TS3_EP, this.pushAllElements)
        },
        pushAllElements: function(obj){
            obj.versions.forEach((element) => {
                this.pushElement(element);
            })
        },
        pushElement: function(element) {
            TS3Table.channels.push({
                channel: element.channel[0].toUpperCase()+element.channel.substring(1),
                version: element.version,
                timestamp: element.timestamp,
                time: parseUnixTime(element.timestamp),
                download: getDownloadButton(element.channel)
            });
        }
    }
});

var TS5Table = new Vue({
    el: '#ts5version',
    data: {
        channels: []
    },
    created: function () {
        this.request();
    },
    methods: {
        request: function() {
            requestJSON(TS5_EP, this.pushAllElements)
        },
        pushAllElements: function(obj){
            obj.versionInfo.forEach((element) => {
                this.pushElement(element);
            })
        },
        pushElement: function(element) {
            TS5Table.channels.push({
                channel: element.platformName[0].toUpperCase()+element.platformName.substring(1),
                version: element.platformInfo.version,
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
    //video.poster = "assets/thumbnails/gray.png";
    video.poster = "assets/thumbnails/white.png";
} else {
    video.poster = "assets/thumbnails/white.png";
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? "dark" : "light";
    if(newColorScheme === "dark"){
        //video.poster = "assets/thumbnails/gray.png";
        video.poster = "assets/thumbnails/white.png";
    } else {
        video.poster = "assets/thumbnails/white.png";
    }
});