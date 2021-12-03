let DISCOVERY_ENDPOINT = "aHR0cHM6Ly9jb3JzLXByb3h5LmR1bmtlbG1hbm4uZXUvNjg3NDc0NzA3MzNhMmYyZjY0Njk3MzYzNmY3NjY1NzI3OTJlNzQ2NTYxNmQ3MzcwNjU2MTZiMmU2MzZmNmQyZjcxNzU2NTcyNzkyZi8=";
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

discoveryCard=function(obj){
    return `<div class="col-md-auto">
                <div class="discovery-object">
                    <div class="discovery-banner" style="background-image: url(${"assets/special/rainbow.gif"});"></div>
                    <div class="discovery-icon">
                        <span style="background-image: url(${"assets/special/nyan_cat.gif"})"></span>
                    </div>
                    <div class="discovery-name">
                        <div class="discovery-name-text"> ${obj.name} </div>
                    </div>
                    <div class="discovery-people">
                        <div class="discovery-people-icon"><i class="fas fa-user fa-discovery-icon"></i></div>
                        <div class="discovery-small-text discovery-people-text"> ${obj.members + (obj.type.toLowerCase() === "server" ? " - " + obj.address : "") } </div>
                    </div>
                    <div class="discovery-desc">
                        <div class="discovery-small-text"> ${obj.topic ?? "No description available"} </div>
                    </div>
                    <div class="discovery-created discovery-small-text"> First seen: ${parseUnixTime(obj.created)} </div>
                    <div class="discovery-footer">
                        <div class="discovery-connect">
                            <div class="discovery-small-text discovery-link"> Join ${obj.type.toLowerCase()} </div>
                        </div>
                        ${
                            obj.type.toLowerCase() === "server" ? 
                            `<div class="discovery-bookmark">
                                <i class="fas fa-bookmark fa-bookmark-icon"></i>
                            </div>
                            <div class="discovery-channel">
                                <i class="fas fa-plus-square ${obj.canCreateChannel ? "fa-channel-icon text-primary" : "fa-channel-icon"}"></i>
                            </div>
                            <div class="discovery-homebase">
                                <i class="fas fa-home ${obj.canCreateHomebase ? "fa-homebase-icon text-primary" : "fa-homebase-icon"}"></i>
                            </div>`
                            : ""
                        }
                    </div>
                </div>
            </div>`
}

doQuery=function(q){
    var query = new XMLHttpRequest();
    query.onreadystatechange = function() {
        if(query.readyState === 4 && query.status === 200){
           var obj = JSON.parse(query.responseText);
           document.getElementById('results').innerHTML = "";
           obj.entries.forEach(element => {
               document.getElementById('results').innerHTML += discoveryCard(element);
           });
        }
    }
    query.open("GET", decodeBase64(DISCOVERY_ENDPOINT) + "?q=" + q + "&start=0&rows=30&sort_by=members&sort_order=desc");
    query.send();
}

const node = document.getElementById("searchbox");
const filter = document.getElementById("filter");
node.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        doQuery((node.value ? `%2B*${encodeURIComponent(node.value)}*` : "*%3A*") + filter.value);
    }
});
filter.addEventListener("change", () => {
    doQuery((node.value ? `%2B*${encodeURIComponent(node.value)}*` : "*%3A*") + filter.value);
});

doQuery("*%3A*");