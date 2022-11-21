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

getEndpointMode=function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has('mode')) {
        return urlParams.get('mode');
    } else {
        return "tsProd";
    }
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
                <div class="discovery-bookmark" :title="card.tooltips.bookmark" v-if="card.isServer" v-on:click="app.bookmark(card.id)">
                    <i :class="card.classes.bookmark"></i>
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
        filterValue: '',
        isLoading: true,
        pagination: {
            elementsPerPage: 30,
            currentStart: 0,
            backwardButton: false,
            forwardButton: false
        },
        annotationText: 'Laden ...',
        webSocket: null
    },
    created: function() {
        this.initWebSocket();
    },
    methods: {
        initWebSocket: function() {
            if(this.webSocket != null) {
                this.webSocket.close();
            }
            this.webSocket = new WebSocket(window.GLOBAL_ENV.WS_API_ENDPOINT);
            this.webSocket.onmessage = function(event) {
                var obj = JSON.parse(event.data);
                if(obj.type === 0) {
                    webSocketLog(obj.msg);

                    // Get obj.payload (base64 encoded) and serialize it to a JSON object
                    var payload = JSON.parse(decodeURIComponent(escape(window.atob((obj.payload)))));

                    payload.entries.forEach(element => {
                        app.cards.push({
                            id: element.id,
                            name: element.name,
                            topic: element.topic ?? 'No description available',
                            people: (element.members ?? 0) + (element.type.toLowerCase() === 'server' ? ' - ' + element.address : ''),
                            created: `First seen: ${parseUnixTime(element.created)}`,
                            join: `Join ${element.type.toLowerCase()}`,
                            banner: `background: ${randomBanner(element.id)}`,
                            icon: `background: url('${randomIcon(element.id)}'); background-size: 64px 64px;`,
                            tooltips: {
                                join: element.type.toLowerCase() === 'server' ? 'Open a connection to this server' : `Join this ${element.type.toLowerCase()}`,
                                bookmark: isBookmarked(element.id) ? 'Unbookmark this server' : 'Bookmark this server',
                                channel: element.canCreateChannel ? 'Guests can create channels' : "Guests can't create channels",
                                homebase: element.canCreateHomebase ? 'Guests can use this server as homebase' : "Guests can't use this server as homebase"
                            },
                            classes: {
                                bookmark: `fas fa-bookmark ${isBookmarked(element.id) ? "fa-bookmark-icon text-primary" : "fa-bookmark-icon"}`,
                                channel: `fas fa-plus-square ${element.canCreateChannel ? "fa-channel-icon text-primary" : "fa-channel-icon"}`,
                                homebase: `fas fa-home ${element.canCreateHomebase ? "fa-homebase-icon text-primary" : "fa-homebase-icon"}`
                            },
                            isServer: element.type.toLowerCase() === 'server'
                        });
                    });

                    app.annotationText = app.cards.length > 0 ? `Zeige ${app.cards.length} (${payload.start + 1} - ${payload.start + app.cards.length }) von ${payload.total} Einträgen` : 'Keine Einträge gefunden';

                    if(payload.total > payload.start + payload.entries.length){
                        app.pagination.forwardButton = true;
                    } else {
                        app.pagination.forwardButton = false;
                    }

                    if(payload.start > 0){
                        app.pagination.backwardButton = true;
                    } else {
                        app.pagination.backwardButton = false;
                    }

                    app.isLoading = false;
                } else if (obj.type === 2) {
                    webSocketLog(`Error: ${obj.msg}`);
                } else if (obj.type === 3) {
                    webSocketLogDebug(`Received PING request from server: "${obj.msg}"`);
                    app.webSocket.send(JSON.stringify({
                        command: "PONG",
                        version: 0,
                        payload: obj.payload
                    }));
                    webSocketLogDebug(`Sent PONG response to server: pongId=${base64ToUuid(obj.payload)}`);
                } else if (obj.type === 4) {
                    webSocketLogDebug(`Server acknowledged PONG response: "${obj.msg}"`);
                } else {
                    webSocketLogWarn("WebSocket returned an response with an unknown type.");
                }
            }

            this.webSocket.onopen = function(event) {
                webSocketLog("WebSocket connected");
                app.doQuery("*%3A*")
            }

            this.webSocket.onclose = function(event) {
                webSocketLog("WebSocket disconnected");

                setTimeout(function() {
                    app.initWebSocket();
                }, 1000);
            }

            this.webSocket.onerror = function(event) {
                webSocketLog("WebSocket error");
            }
        },
        queryWithFilter: function() {
            app.pagination.currentStart = 0;
            app.doQuery((this.nodeValue ? `%2B*${encodeURIComponent(this.nodeValue)}*` : "*%3A*") + this.filterValue);
        },
        doQuery: function(q) {
            this.isLoading = true;
            this.cards = [];

            this.pagination.backwardButton = false;
            this.pagination.forwardButton = false;
            this.annotationText = 'Laden ...';

            if (this.webSocket == null) {
                this.initWebSocket();
            }

            if (this.webSocket.readyState !== WebSocket.OPEN) {
                webSocketLog("WebSocket not ready");
                return;
            }

            let payload = btoa(JSON.stringify({
                endpointMode: getEndpointMode(),
                queryString: q,
                startCount: this.pagination.currentStart,
                rowCount: this.pagination.elementsPerPage,
                sortBy: "members",
                sortOrder: "desc"
            }));

            this.webSocket.send(JSON.stringify({
                command: "getTeamSpeakRoomDiscovery",
                version: 1,
                payload: payload
            }));
        },
        goForward: function() {
            if(this.pagination.forwardButton && !this.isLoading) {
                this.pagination.currentStart += this.pagination.elementsPerPage;
                this.doQuery((this.nodeValue ? `%2B*${encodeURIComponent(this.nodeValue)}*` : "*%3A*") + this.filterValue);
            }
        },
        goBackward: function() {
            if(this.pagination.backwardButton && !this.isLoading) {
                this.pagination.currentStart -= this.pagination.elementsPerPage;
                this.doQuery((this.nodeValue ? `%2B*${encodeURIComponent(this.nodeValue)}*` : "*%3A*") + this.filterValue);
            }
        },
        bookmark: function(id) {
            // Check if the server is already bookmarked
            if (isBookmarked(id)) {
                removeBookmark(id);
            } else {
                addBookmark(id);
            }
            // Update the bookmark icon and tooltip
            this.cards.forEach(function(element) {
                if (element.id === id) {
                    element.classes.bookmark = `fas fa-bookmark ${isBookmarked(element.id) ? "fa-bookmark-icon text-primary" : "fa-bookmark-icon"}`;
                    element.tooltips.bookmark = isBookmarked(element.id) ? 'Unbookmark this server' : 'Bookmark this server';
                }
            });
        }
    },
    watch: {
        filterValue: function() {
            this.queryWithFilter();
        }
    }
});