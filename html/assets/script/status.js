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

let STATUS_URL = "aHR0cHM6Ly9hcGkuZHVua2VsbWFubi5ldS9zdGF0dXM=";
decodeBase64=function(f){var g={},b=65,d=0,a,c=0,h,e="",k=String.fromCharCode,l=f.length;for(a="";91>b;)a+=k(b++);a+=a.toLowerCase()+"0123456789+/";for(b=0;64>b;b++)g[a.charAt(b)]=b;for(a=0;a<l;a++)for(b=g[f.charAt(a)],d=(d<<6)+b,c+=6;8<=c;)((h=d>>>(c-=8)&255)||a<l-2)&&(e+=k(h));return e};

let dict = {
	'website': 'Homepage',
	'api': 'Dunkelmann-API',
	'matrix': 'Chat-Server (Synapse)',
	'insomnium': 'Chat-Server (Insomnium)',
	'mail': 'Mail-Server (Postfix)',
	'cloud': 'Dunkelmann-Cloud'
};

Vue.component('status-service', {
	props: ['status'],
	template: `
	<tr :id="status.id">
	<th scope="col">{{ status.name }}</th>
	<td>{{ status.id }}</td>
	<td>{{ status.url }}</td>
	<td><i :class="status.status.classes"></i> {{ status.status.message }}</td>
	</tr>
	`
});

var app = new Vue({
	el: '#statusApp',
	data: {
		services: []
	},
	created: function() {
		this.requestData();
	},
	methods: {
		getClassText: function(code) {
			if(200 <= code && code <= 299){
				return "success";
			} else if(300 <= code && code <= 399) {
				return "redirection";
			} else if(400 <= code && code <= 499) {
				return "warning";
			} else if(500 <= code && code <= 599) {
				return "danger";
			} else if(600 <= code && code <= 699) {
				return "primary";
			} else {
				return "secondary";
			}
		},
		requestData: function() {
			var req = new XMLHttpRequest();
			req.onreadystatechange = function() {
			if(req.readyState === 4 && req.status === 200){
			var resp = JSON.parse(req.responseText);
			
			resp.forEach(function(obj) {
				app.services.push({
					name: dict[obj.id],
					id: obj.id,
					url: obj.url,
					status: {
						classes: `fas fa-circle text-${app.getClassText(obj.statusCode)}`,
						message: `${obj.statusCode} ${obj.statusDesc}`
					}
				});
			});
			
			} else if (req.readyState === 4) {
			
			}
			}
			req.open("GET", decodeBase64(STATUS_URL));
			req.send();
		}
	}
});