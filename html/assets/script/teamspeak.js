
jebaited=function(){
    var vid = document.getElementById('vid');
    vid.play();

    var el = document.querySelectorAll("div,table,p,code,tr,td,th");
    for(var i=0;i<el.length;i++){
el[i].className += " special";
}

    var all = document.querySelectorAll(".bg-primary,.accordion-button,.btn-primary,.btn-danger");
for (var i = 0; i < all.length; i++) {
all[i].style.setProperty("background-image", "url(assets/special/rainbow.gif)", "important");
}
}

let TS3_EP = "aHR0cHM6Ly9hcGkuZHVua2VsbWFubi5ldS90czN2ZXJzaW9u";
let TS5_EP = "aHR0cHM6Ly9hcGkuZHVua2VsbWFubi5ldS90czV2ZXJzaW9u";

let STABLE_URL = "aHR0cHM6Ly90ZWFtc3BlYWsuY29tL2VuL2Rvd25sb2Fkcy8jY2xpZW50";
let SERVER_URL = "aHR0cHM6Ly90ZWFtc3BlYWsuY29tL2VuL2Rvd25sb2Fkcy8jc2VydmVy";
let BETA_URL = "";
let ALPHA_URL = "";

let TS5_URL = "aHR0cHM6Ly93d3cudGVhbXNwZWFrLmNvbS9kZS9kb3dubG9hZHMvI3RzNQ==";
decodeBase64=function(f){var g={},b=65,d=0,a,c=0,h,e="",k=String.fromCharCode,l=f.length;for(a="";91>b;)a+=k(b++);a+=a.toLowerCase()+"0123456789+/";for(b=0;64>b;b++)g[a.charAt(b)]=b;for(a=0;a<l;a++)for(b=g[f.charAt(a)],d=(d<<6)+b,c+=6;8<=c;)((h=d>>>(c-=8)&255)||a<l-2)&&(e+=k(h));return e};

getDownloadButton=function(f){
    if(f.toLowerCase() == "beta"){
        return "<td><button type=\"button\" class=\"btn btn-primary\" data-bs-toggle=\"modal\" data-bs-target=\"#modalBeta\">Download</button></td>";
    } else if (f.toLowerCase() == "alpha"){
        
        return "<td><button type=\"button\" class=\"btn btn-danger cursor-not-allowed\" onclick=\"jebaited();\">Download</button></td>";
    } else {
        return "<td><button type=\"button\" class=\"btn btn-primary\" onclick=\"window.open(decodeBase64("+ f.toUpperCase() +"_URL), '_blank').focus();\">Download</button></td>";
    }
}

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

var tRequest = new XMLHttpRequest();
tRequest.onreadystatechange = function() {
    if(tRequest.readyState === 4 && tRequest.status === 200){
        var obj = JSON.parse(tRequest.responseText);
        obj.versions.forEach(element => {
            document.getElementById('ts3version').innerHTML += "<tr><th scope=\"row\">"+element.channel[0].toUpperCase()+element.channel.substring(1)+"</th><td>"+element.version+" [Build: <abbr title=\"" + parseUnixTime(element.timestamp) + "\">"+element.timestamp+"</abbr>]</td>" + getDownloadButton(element.channel) + "</tr>";
        });
    }
}
tRequest.open("GET", decodeBase64(TS3_EP));
tRequest.send();

var fRequest = new XMLHttpRequest();
fRequest.onreadystatechange = function() {
    if(fRequest.readyState === 4 && fRequest.status === 200){
        var obj = JSON.parse(fRequest.responseText);
        obj.versionInfo.forEach(element => {
            document.getElementById('ts5version').innerHTML += "<tr><th scope=\"row\">"+element.platformName[0].toUpperCase()+element.platformName.substring(1)+"</th><td>"+element.platformInfo.version+"-"+element.platformInfo.version_string + " [Build: <abbr title=\"" + parseUnixTime(element.platformInfo.timestamp) + "\">"+element.platformInfo.timestamp+"</abbr>]</td><td><button type=\"button\" class=\"btn btn-primary\" onclick=\"window.open(decodeBase64(TS5_URL), '_blank').focus();\">Download</button></td></tr>";
        });
    }
}
fRequest.open("GET", decodeBase64(TS5_EP));
fRequest.send();