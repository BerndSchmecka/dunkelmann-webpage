let DISCOVERY_ENDPOINT = "aHR0cHM6Ly9jb3JzLXByb3h5LmR1bmtlbG1hbm4uZXUvNjg3NDc0NzA3MzNhMmYyZjY0Njk3MzYzNmY3NjY1NzI3OTJlNzQ2NTYxNmQ3MzcwNjU2MTZiMmU2MzZmNmQyZjcxNzU2NTcyNzkyZi8=";
decodeBase64=function(f){var g={},b=65,d=0,a,c=0,h,e="",k=String.fromCharCode,l=f.length;for(a="";91>b;)a+=k(b++);a+=a.toLowerCase()+"0123456789+/";for(b=0;64>b;b++)g[a.charAt(b)]=b;for(a=0;a<l;a++)for(b=g[f.charAt(a)],d=(d<<6)+b,c+=6;8<=c;)((h=d>>>(c-=8)&255)||a<l-2)&&(e+=k(h));return e};

doQuery=function(q){
    var query = new XMLHttpRequest();
    query.onreadystatechange = function() {
        if(query.readyState === 4 && query.status === 200){
           var obj = JSON.parse(query.responseText);
           obj.entries.forEach(element => {
               document.getElementById('results').innerHTML += "<div class=\"col-md-auto\">" + element + "</div>";
           });
        }
    }
    query.open("GET", decodeBase64(DISCOVERY_ENDPOINT) + "?q=" + q + "&start=0&rows=30&sort_by=members&sort_order=desc");
    query.send();
}

doQuery("*%3A*");