var index = 0;
var colorArr = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
function flashtext() {

    var el = document.querySelectorAll('*');
    for(var i=0;i<el.length;i++){
el[i].style.setProperty("color", colorArr[index], "important");
}
  index++;
  if(index>colorArr.length) {index = 0;}
}



jebaited=function(){
    var vid = document.getElementById('vid');
    vid.play();
    var all = document.getElementsByClassName('bg-primary');
for (var i = 0; i < all.length; i++) {
all[i].style.setProperty("background-image", "url(assets/special/rainbow.gif)", "important");
}
var all = document.getElementsByClassName('btn-primary');
for (var i = 0; i < all.length; i++) {
all[i].style.setProperty("background-image", "url(assets/special/rainbow.gif)", "important");
}
var all = document.getElementsByClassName('btn-danger');
for (var i = 0; i < all.length; i++) {
all[i].style.setProperty("background-image", "url(assets/special/rainbow.gif)", "important");
}
    setInterval(function() {
        flashtext();
    }, 250 );
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

var tRequest = new XMLHttpRequest();
tRequest.onreadystatechange = function() {
    if(tRequest.readyState === 4 && tRequest.status === 200){
        var obj = JSON.parse(tRequest.responseText);
        obj.versions.forEach(element => {
            document.getElementById('ts3version').innerHTML += "<tr><th scope=\"row\">"+element.channel[0].toUpperCase()+element.channel.substring(1)+"</th><td>"+element.version+" [Build: "+element.timestamp+"]</td>" + getDownloadButton(element.channel) + "</tr>";
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
            document.getElementById('ts5version').innerHTML += "<tr><th scope=\"row\">"+element.platformName[0].toUpperCase()+element.platformName.substring(1)+"</th><td>"+element.platformInfo.version+"-"+element.platformInfo.version_string + " [Build: "+element.platformInfo.timestamp+"]</td><td><button type=\"button\" class=\"btn btn-primary\" onclick=\"window.open(decodeBase64(TS5_URL), '_blank').focus();\">Download</button></td></tr>";
        });
    }
}
fRequest.open("GET", decodeBase64(TS5_EP));
fRequest.send();