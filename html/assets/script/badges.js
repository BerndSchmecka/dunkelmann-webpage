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

Vue.component('badge-card', {
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
});

var app = new Vue({
    el: '#badgesApp',
    data: {
        revisionValue: 'latest',
        revisionList: [],
        rev: 0,
        lastMod: 0,
        cards: [],
        isLoading: true
    },
    created: function() {
        this.queryBadges();
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
        queryBadges: function() {
            this.isLoading = true;
            this.cards = [];

            var query = new XMLHttpRequest();
            query.onreadystatechange = function() {
                if(query.readyState === 4 && query.status === 200){
                    var obj = JSON.parse(query.responseText);

                    app.rev = obj.body.revision;
                    app.lastMod = obj.body.timestamp;
        
                    obj.body.badges.forEach(element => {
                        app.cards.push({
                            uuid: element.uuid,
                            name: element.name,
                            base_url: element.url,
                            description: element.description,
                            date: parseUnixTime(element.timestamp),
                            value: element.value
                        });
                    });

                    app.isLoading = false;
                }
            }
            query.open("POST", window.GLOBAL_ENV.BADGE_ENDPOINT, true);
            query.send(
                JSON.stringify({
                    "revision": this.revisionValue
                })
            );
        },
        parseUnixTime: function(t){
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
    },
    watch: {
        revisionValue: function() {
            this.queryBadges();
        }
    }
});
