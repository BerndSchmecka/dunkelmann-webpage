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

/*Vue.component('badge-card', {
    props: ['card'],
    template: `
    <div class="col-md-auto">
    <div class="badge-object">
        <div class="badge-icon">
            <img class="badge-image" :src="card.base_url + '_details.svg'" :alt="card.name">
        </div>
        <div class="badge-icon">
            <img class="badge-image" :src="card.base_url + '.svg'" :alt="card.name">
        </div>
        <div class="badge-name">
            <div class="badge-name-text">{{ card.name }}</div>
        </div>
        <div class="badge-desc">
            <div class="badge-small-text">{{ card.description }}</div>
        </div>
        <div class="badge-uuid">
            <div class="badge-guid-text">{{ card.uuid }}</div>
        </div>
        <div class="badge-date">
            <div class="badge-small-text">{{ card.date }}</div>
        </div>
    </div>
</div>
    `
});*/

Vue.component('badge-card', {
    props: ['card'],
    template: `
    <div class="badge-object">
            <img width="64px" height="64px" :src="card.svg_details_url" :alt="card.name" :title="card.name" v-on:click="app.selectBadge(card.uuid)">
    </div>
    `
});

var app = new Vue({
    el: '#badgesApp',
    data: {
        revisionValue: 'latest',
        revisionList: [],
        revText: 'Laden ...',
        lmText: 'Laden ...',
        countText: 'Laden ...',
        searchValue: '',
        cards: [],
        selectedBadge: {
            uuid: "Laden ...",
            name: "Laden ...",
            svg_url: null,
            svg_details_url: null,
            description: "Laden ...",
            date: parseUnixTime(0),
            value: 0
        },
        isLoading: true,
        isCaching: false,
        showcaseHidden: false,
        webSocket: null,
    },
    created: function() {
        this.initWebSocket();
        this.getCachedRevisions();
    },
    methods: {
        getCachedRevisions: function() {
            var query = new XMLHttpRequest();
            query.onreadystatechange = function() {
                if(query.readyState === 4 && query.status === 200){
                    var obj = JSON.parse(query.responseText);

                    app.revisionList = [];

                    obj.cachedRevisions.slice().reverse().forEach(e => {
                        app.revisionList.push({
                            name: e,
                            id: e
                        });
                    });
                }
            }
            query.open("GET", window.GLOBAL_ENV.BADGE_REVISIONS_ENDPOINT, true);
            query.send();
        },
        initWebSocket: function() {
            if(this.webSocket != null) {
                this.webSocket.close();
            }
            this.webSocket = new WebSocket(window.GLOBAL_ENV.WS_API_ENDPOINT);
            this.webSocket.onmessage = function(event) {
                var obj = JSON.parse(event.data);
                if(obj.type === 0) {
                    app.isCaching = false;
                    webSocketLog(obj.msg);

                    // Get obj.payload (base64 encoded) and serialize it to a JSON object
                    var payload = JSON.parse(atob(obj.payload));

                    var date = payload.headers["Last-Modified"][0];
                    var lastModified = Math.floor(Date.parse(date) / 1000);
        
                    payload.body.badges.forEach(element => {
                        if(app.searchValue == '' || element.name.toLowerCase().includes(app.searchValue.toLowerCase()) || element.description.toLowerCase().includes(app.searchValue.toLowerCase()) || element.url.toLowerCase().includes(app.searchValue.toLowerCase())) {
                            app.cards.push({
                                uuid: element.uuid,
                                name: element.name,
                                svg_url: app.revisionValue == 'latest' ? element.url + '.svg' : `https://www.dunkelmann.eu/static/badge-cache/${app.revisionValue}.bundle/${element.uuid}/${element.uuid}.svg`,
                                svg_details_url: app.revisionValue == 'latest' ? element.url + '_details.svg' : `https://www.dunkelmann.eu/static/badge-cache/${app.revisionValue}.bundle/${element.uuid}/${element.uuid}_details.svg`,
                                description: element.description,
                                date: parseUnixTime(element.timestamp),
                                value: element.value
                            });
                        }
                    });

                    app.revText = `Revisionsnummer: ${payload.body.revision} [${parseUnixTime(payload.body.timestamp)}]`;
                    app.lmText = `Letzte Änderung: ${parseUnixTime(lastModified)}`;
                    app.countText = `Zeige ${app.cards.length} von ${payload.body.badges.length} Abzeichen`;
                    if(app.cards.length > 0){
                        app.selectedBadge = app.cards[app.cards.length - 1];
                        app.showcaseHidden = false;
                    } else {
                        app.showcaseHidden = true;
                        app.selectedBadge = {
                            uuid: "Laden ...",
                            name: "Laden ...",
                            base_url: null,
                            description: "Laden ...",
                            date: parseUnixTime(0),
                            value: 0
                        }
                    }

                    app.isLoading = false;
                } else if (obj.type === 1) {
                    app.isCaching = true;
                    webSocketLog(obj.msg);
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
                app.queryBadges();
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
        queryBadges: function() {
            this.isLoading = true;
            this.cards = [];

            this.revText = 'Laden ...';
            this.lmText = 'Laden ...';
            this.countText = 'Laden ...';

            if (this.webSocket == null) {
                this.initWebSocket();
            }

            if (this.webSocket.readyState !== WebSocket.OPEN) {
                webSocketLog("WebSocket not ready");
                return;
            }

            let payload = btoa(JSON.stringify({
                revision: this.revisionValue
            }));

            this.webSocket.send(JSON.stringify({
                command: "getTeamSpeakBadges",
                version: 1,
                payload: payload
            }));
        },
        selectBadge: function(uuid) {
            this.cards.forEach(element => {
                if(element.uuid == uuid) {
                    this.selectedBadge = element;
                }
            });
        }
    },
    watch: {
        revisionValue: function() {
            this.queryBadges();
        }
    }
});
