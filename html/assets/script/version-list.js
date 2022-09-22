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

let VERSIONLIST_EP = 'https://raw.githubusercontent.com/ReSpeak/tsdeclarations/master/Versions.csv';

parseUnixTime=function(t){
    var date = new Date(t * 1000);
    var curr_date = "0" + date.getDate();
    var curr_month = "0" + (date.getMonth() + 1); //Months are zero based
    var curr_year = date.getFullYear();
    var hours = "0" + date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = curr_date.substr(-2) + '.' + curr_month.substr(-2)  + '.' + curr_year + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

Vue.component('lm-annotation', {
    props: ['lm'],
    template: `<span class="annotation">Zuletzt geändert am: <abbr :title="lm.unix">{{ lm.text }}</abbr></span>`
});

//new Vue app instance that attaches to #versionListApp
var app = new Vue({
    el: '#versionListApp',
    data: {
        headers: [],
        versions: [],
        vllastModified: {
            key: 0,
            unix: 0,
            text: ""
        },
        isLoading: true
    },
    created: function () {
        this.getVersions();
    },
    methods: {
        getVersions: function(){
            //make XHR request to VERSIONLIST_EP
            //get the versions from the response
            //return the versions
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if(request.readyState === 4 && request.status === 200){
                    // get Last-Modified header
                    var date = request.getResponseHeader('Last-Modified');
                    var lastModified = Math.floor(Date.parse(date) / 1000);

                    app.vllastModified.unix = lastModified
                    app.vllastModified.text = parseUnixTime(lastModified)

                    // get versions
                    Papa.parse(request.responseText, {
                        complete: (result) => {
                            app.headers = result.data[0];
                            app.versions = result.data.slice(1);
                            app.isLoading = false;
                        }
                    });
                }
            };
            request.open('GET', VERSIONLIST_EP, true);
            request.send();
        }
    }
});