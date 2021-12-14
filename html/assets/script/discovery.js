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

var DiscoveryCards = new Vue({
    el: '#cardsDiv',
    data: {
        cards: []
    },
    created: function() {
        this.doQuery("*%3A*");
    },
    methods: {
        doQuery: function(q) {
            var query = new XMLHttpRequest();
            query.onreadystatechange = function() {
                if(query.readyState === 4 && query.status === 200){
                    var obj = JSON.parse(query.responseText);
        
                    DiscoveryCards.cards = [];
        
                    obj.entries.forEach(element => {
                        DiscoveryCards.cards.push({
                            name: element.name,
                            topic: element.topic ?? 'No description available',
                            people: element.members + (element.type.toLowerCase() === 'server' ? ' - ' + element.address : ''),
                            created: `First seen: ${parseUnixTime(element.created)}`,
                            join: `Join ${element.type.toLowerCase()}`,
                            tooltips: {
                                join: element.type.toLowerCase() === 'server' ? 'Open a connection to this server' : `Join this ${element.type.toLowerCase()}`,
                                channel: element.canCreateChannel ? 'Guests can create channels' : "Guests can't create channels",
                                homebase: element.canCreateHomebase ? 'Guests can use this server as homebase' : "Guests can't use this server as homebase"
                            },
                            classes: {
                                channel: `fas fa-plus-square ${element.canCreateChannel ? "fa-channel-icon text-primary" : "fa-channel-icon"}`,
                                homebase: `fas fa-home ${element.canCreateHomebase ? "fa-homebase-icon text-primary" : "fa-homebase-icon"}`
                            },
                            isServer: element.type.toLowerCase() === 'server'
                        });
                    });
                }
            }
            query.open("GET", decodeBase64(DISCOVERY_ENDPOINT) + "?q=" + q + "&start=0&rows=30&sort_by=members&sort_order=desc");
            query.send();
        }
    }
});

var control = new Vue({
    el: '#control_elements',
    data: {
        nodeValue: '',
        filterValue: ''
    },
    methods: {
        queryWithFilter: function() {
            DiscoveryCards.doQuery((this.nodeValue ? `%2B*${encodeURIComponent(this.nodeValue)}*` : "*%3A*") + this.filterValue);
        }
    },
    watch: {
        filterValue: function() {
            this.queryWithFilter();
        }
    }
});