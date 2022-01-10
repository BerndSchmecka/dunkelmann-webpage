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

randomBanner=function(id){
    const colors = [
        [//green
            "rgba(2,25,0,1)",
            "rgba(28,97,20,1)",
            "rgba(16,173,2,1)",
            "rgba(31,255,0,1)"
        ],
        [//blue (default)
            "rgba(2,0,36,1)",
            "rgba(39,39,200,1)",
            "rgba(2,117,215,1)",
            "rgba(0,212,255,1)"
        ],
        [//red
            "rgba(25,0,0,1)",
            "rgba(97,20,20,1)",
            "rgba(173,2,2,1)",
            "rgba(255,0,0,1)"
        ],
        [//yellow
            "rgba(25,25,0,1)",
            "rgba(97,97,20,1)",
            "rgba(169,173,2,1)",
            "rgba(254,255,0,1)"
        ],
        [//purple
            "rgba(23,0,25,1)",
            "rgba(88,20,97,1)",
            "rgba(157,2,173,1)",
            "rgba(226,0,255,1)"
        ],
        [//orange
            "rgba(25,14,0,1)",
            "rgba(97,60,20,1)",
            "rgba(173,94,2,1)",
            "rgba(255,128,0,1)"
        ]
    ]

    const choosen = colors[id.charCodeAt(3) % colors.length];
    return `linear-gradient(180deg, ${choosen[0]} 0%, ${choosen[1]} 33%, ${choosen[2]} 63%, ${choosen[3]} 100%);`;
}

randomIcon=function(id){
    return `https://www.gravatar.com/avatar/${CryptoJS.MD5(id)}?s=128&d=identicon`
}

Vue.directive('emoji', {
    inserted (el) {
        twemoji.parse(el, {  size: 'svg', ext: '.svg' })
    }
})

Vue.component('discovery-card', {
    props: ['card'],
    template: `
    <div class="col-md-auto">
    <div class="discovery-object" v-emoji>
        <div class="discovery-banner" :style="card.banner"></div>
        <div class="discovery-icon">
            <span :style="card.icon"></span>
        </div>
        <div class="discovery-name">
            <div class="discovery-name-text" :title="card.name"> {{ card.name }} </div>
        </div>
        <div class="discovery-people">
            <div class="discovery-people-icon"><i class="fas fa-user fa-discovery-icon"></i></div>
            <div class="discovery-small-text discovery-people-text"> {{ card.people }} </div>
        </div>
        <div class="discovery-desc">
            <div class="discovery-small-text"> {{ card.topic }} </div>
        </div>
        <div class="discovery-created discovery-small-text"> {{ card.created }} </div>
        <div class="discovery-footer">
            <div class="discovery-connect">
                <div class="discovery-small-text discovery-link" :title="card.tooltips.join"> {{ card.join }} </div>
            </div>
                <div class="discovery-bookmark" title="Bookmark this server" v-if="card.isServer">
                    <i class="fas fa-bookmark fa-bookmark-icon"></i>
                </div>
                <div class="discovery-channel" :title="card.tooltips.channel" v-if="card.isServer">
                    <i :class="card.classes.channel"></i>
                </div>
                <div class="discovery-homebase" :title="card.tooltips.homebase" v-if="card.isServer">
                    <i :class="card.classes.homebase"></i>
                </div>
        </div>
    </div>
</div>
    `
});

var app = new Vue({
    el: '#discoveryApp',
    data: {
        cards: [],
        nodeValue: '',
        filterValue: ''
    },
    created: function() {
        this.doQuery("*%3A*");
    },
    methods: {
        queryWithFilter: function() {
            app.doQuery((this.nodeValue ? `%2B*${encodeURIComponent(this.nodeValue)}*` : "*%3A*") + this.filterValue);
        },
        doQuery: function(q) {
            var query = new XMLHttpRequest();
            query.onreadystatechange = function() {
                if(query.readyState === 4 && query.status === 200){
                    var obj = JSON.parse(query.responseText);
        
                    app.cards = [];
        
                    obj.entries.forEach(element => {
                        app.cards.push({
                            id: element.id,
                            name: element.name,
                            topic: element.topic ?? 'No description available',
                            people: element.members + (element.type.toLowerCase() === 'server' ? ' - ' + element.address : ''),
                            created: `First seen: ${parseUnixTime(element.created)}`,
                            join: `Join ${element.type.toLowerCase()}`,
                            banner: `background: ${randomBanner(element.id)}`,
                            icon: `background: url('${randomIcon(element.id)}'); background-size: 64px 64px;`,
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
    },
    watch: {
        filterValue: function() {
            this.queryWithFilter();
        }
    }
});