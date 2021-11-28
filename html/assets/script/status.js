let STATUS_URL = "aHR0cHM6Ly9hcGkuZHVua2VsbWFubi5ldS9zdGF0dXM=";
decodeBase64=function(f){var g={},b=65,d=0,a,c=0,h,e="",k=String.fromCharCode,l=f.length;for(a="";91>b;)a+=k(b++);a+=a.toLowerCase()+"0123456789+/";for(b=0;64>b;b++)g[a.charAt(b)]=b;for(a=0;a<l;a++)for(b=g[f.charAt(a)],d=(d<<6)+b,c+=6;8<=c;)((h=d>>>(c-=8)&255)||a<l-2)&&(e+=k(h));return e};

			function appendImage(obj, name) {
			document.getElementById(obj.id).innerHTML += "<td><i class=\"fas fa-circle text-" + name + "\"></i> "+obj.statusCode+" "+obj.statusDesc+"</td>"
			}
			
			var req = new XMLHttpRequest();
			req.onreadystatechange = function() {
			if(req.readyState === 4 && req.status === 200){
			var resp = JSON.parse(req.responseText);
			
			resp.forEach(function(obj) {
			document.getElementById(obj.id).innerHTML += "<td>"+obj.id+"</td>"
								  +  "<td>"+obj.url+"</td>";
			
			if(200 <= obj.statusCode && obj.statusCode <= 299){
			appendImage(obj, "success");
			} else if(300 <= obj.statusCode && obj.statusCode <= 399) {
			appendImage(obj, "redirection");
			} else if(400 <= obj.statusCode && obj.statusCode <= 499) {
			appendImage(obj, "warning");
			} else if(500 <= obj.statusCode && obj.statusCode <= 599) {
			appendImage(obj, "danger");
			} else if(600 <= obj.statusCode && obj.statusCode <= 699) {
			appendImage(obj, "primary");
			} else {
			appendImage(obj, "secondary");
			}
			
			});
			
			} else if (req.readyState === 4) {
			
			}
			}
			req.open("GET", decodeBase64(STATUS_URL));
			req.send();