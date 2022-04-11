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

//new Vue app instance that attaches to #tweetDecryptorApp
var app = new Vue({
    el: '#tweetDecryptorApp',
    data: {
        iv: '',
        msg: '',
        sign: '',
        cleartext: ''
    },
    methods: {
        decrypt: function(){
            //make XHR request to https://api.dunkelmann.eu/aesdecrypt with the following data:
            //iv: this.iv
            //msg: this.msg
            //sign: this.sign
            //get the cleartext from the response
            //return the cleartext
            //on error status code 500 alert the errorMessage

            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if(request.readyState === 4 && request.status === 200){
                    var obj = JSON.parse(request.responseText);
                    document.getElementById('tweetDecryptorCleartext').value = obj.cleartext;
                    this.cleartext = obj.cleartext;
                } else if(request.readyState === 4 && request.status === 500) {
                    var obj = JSON.parse(request.responseText);
                    alert(obj.errorMessage);
                }
            };
            request.open('POST', 'https://api.dunkelmann.eu/aesdecrypt', true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify({
                iv: this.iv,
                msg: this.msg,
                sign: this.sign
            }));
        }
    }
});